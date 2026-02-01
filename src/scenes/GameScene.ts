import Phaser from 'phaser';

type ItemType = 'weapon' | 'armor' | 'consumable';

type Item = {
  id: string;
  name: string;
  type: ItemType;
  attack?: number;
  hp?: number;
  price?: number;
};

type PlayerData = {
  hp: number;
  maxHp: number;
  xp: number;
  level: number;
  baseAttack: number;
  gold: number;
  inventory: Item[];
  equipment: {
    weapon?: Item | null;
    armor?: Item | null;
  };
};

const SAVE_KEY = 'margonem_prototype_save_v1';

export default class GameScene extends Phaser.Scene {
  cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  keyW!: Phaser.Input.Keyboard.Key;
  keyA!: Phaser.Input.Keyboard.Key;
  keyS!: Phaser.Input.Keyboard.Key;
  keyD!: Phaser.Input.Keyboard.Key;
  keySpace!: Phaser.Input.Keyboard.Key;
  keyE!: Phaser.Input.Keyboard.Key;
  keyQ!: Phaser.Input.Keyboard.Key;
  keyB!: Phaser.Input.Keyboard.Key;
  keyI!: Phaser.Input.Keyboard.Key;
  numberKeys: Phaser.Input.Keyboard.Key[] = [];

  player!: Phaser.Physics.Arcade.Sprite;
  playerData: PlayerData = {
    hp: 20,
    maxHp: 20,
    xp: 0,
    level: 1,
    baseAttack: 5,
    gold: 25,
    inventory: [],
    equipment: {
      weapon: null,
      armor: null
    }
  };

  hudText!: Phaser.GameObjects.Text;
  invText!: Phaser.GameObjects.Text;
  shopText!: Phaser.GameObjects.Text;
  enemies!: Phaser.Physics.Arcade.Group;
  itemsOnGround!: Phaser.Physics.Arcade.Group;

  spawnTimer = 0;
  skillCooldownUntil = 0;

  shopOpen = false;
  invOpen = false;

  shopItems: Item[] = [
    { id: 'sword_1', name: 'Miecz Żelazny', type: 'weapon', attack: 3, price: 30 },
    { id: 'armor_1', name: 'Skórzana Kirys', type: 'armor', hp: 6, price: 28 },
    { id: 'potion_1', name: 'Mikstura HP', type: 'consumable', hp: 10, price: 12 }
  ];

  constructor() {
    super({ key: 'GameScene' });
  }

  create() {
    // tło kafelkowe
    for (let y = 0; y < 600; y += 32) {
      for (let x = 0; x < 800; x += 32) {
        this.add.image(x + 16, y + 16, 'tile_tex').setAlpha(0.6);
      }
    }

    // player jako sprite z tekstury
    this.player = this.physics.add.sprite(400, 300, 'player_tex') as any;
    this.player.setCollideWorldBounds(true);

    // input
    this.cursors = this.input.keyboard.createCursorKeys();
    this.keyW = this.input.keyboard.addKey('W');
    this.keyA = this.input.keyboard.addKey('A');
    this.keyS = this.input.keyboard.addKey('S');
    this.keyD = this.input.keyboard.addKey('D');
    this.keySpace = this.input.keyboard.addKey('SPACE');
    this.keyE = this.input.keyboard.addKey('E');
    this.keyQ = this.input.keyboard.addKey('Q');
    this.keyB = this.input.keyboard.addKey('B');
    this.keyI = this.input.keyboard.addKey('I');

    // number keys 1..5 for shop selection
    for (let i = 1; i <= 5; i++) {
      this.numberKeys.push(this.input.keyboard.addKey(String(i)));
    }

    // enemies group and items group
    this.enemies = this.physics.add.group();
    this.itemsOnGround = this.physics.add.group();

    // kolizja overlap player <-> items (pickup via E)
    this.physics.add.overlap(this.player, this.itemsOnGround, undefined, undefined, this);

    // HUD
    this.hudText = this.add.text(8, 8, '', { font: '16px Arial', color: '#ffffff' }).setDepth(10);
    this.invText = this.add.text(8, 120, '', { font: '14px monospace', color: '#ffffff' }).setDepth(10);
    this.shopText = this.add.text(400, 80, '', { font: '16px Arial', color: '#ffff88', align: 'center' }).setDepth(11).setOrigin(0.5);

    // instrukcja
    this.add.text(8, 560, 'Ruch: WASD / strzałki. Atak: SPACJA. Umiejętność: Q. Weź przedmiot: E. Sklep: B. Ekwipunek: I.', {
      font: '14px Arial',
      color: '#ddd'
    });

    // load save jeśli istnieje
    this.loadSave();

    // spawn wrogów
    for (let i = 0; i < 4; i++) this.spawnEnemy();

    // physics world bounds
    this.physics.world.setBounds(0, 0, 800, 600);

    // enemies move logic: update in update loop
  }

  update(time: number) {
    this.handleMovement();
    this.handleAttacks(time);
    this.handlePickups();
    this.updateEnemiesBehavior(time);

    // spawn co kilka sekund
    if (time > this.spawnTimer) {
      this.spawnTimer = time + Phaser.Math.Between(3000, 6000);
      if (this.enemies.getLength() < 8) this.spawnEnemy();
    }

    // update HUD
    this.hudText.setText(this.hudString());
    this.updateInventoryUI();
    this.updateShopUI();

    // save autosave (debounced naive)
    // zapis przy każdej klatce byłby zbyt częsty, zapisujemy rzadziej
    if (time % 5000 < 16) {
      this.saveGame();
    }
  }

  handleMovement() {
    const speed = 160;
    let vx = 0;
    let vy = 0;
    if (this.cursors.left?.isDown || this.keyA.isDown) vx = -speed;
    else if (this.cursors.right?.isDown || this.keyD.isDown) vx = speed;
    if (this.cursors.up?.isDown || this.keyW.isDown) vy = -speed;
    else if (this.cursors.down?.isDown || this.keyS.isDown) vy = speed;

    this.player.body.setVelocity(vx, vy);
    if (vx !== 0 && vy !== 0) {
      this.player.body.setVelocity(vx * 0.707, vy * 0.707);
    }
  }

  handleAttacks(time: number) {
    // podstawowy atak
    if (Phaser.Input.Keyboard.JustDown(this.keySpace)) {
      const target = this.findNearbyEnemy(48);
      if (!target) {
        this.showFloatingText(this.player.x, this.player.y - 30, 'Brak celu', '#ffcc00');
      } else {
        const dmg = this.computeAttackDamage();
        this.dealDamageToEnemy(target, dmg);
        this.showFloatingText(target.x, target.y - 12, `-${dmg}`, '#ff4444');
      }
    }

    // umiejętność Q z cooldownem (silny cios)
    if (Phaser.Input.Keyboard.JustDown(this.keyQ)) {
      if (time < this.skillCooldownUntil) {
        const remaining = Math.ceil((this.skillCooldownUntil - time) / 1000);
        this.showFloatingText(this.player.x, this.player.y - 40, `Cooldown: ${remaining}s`, '#ffbb66');
      } else {
        const target = this.findNearbyEnemy(80);
        if (!target) {
          this.showFloatingText(this.player.x, this.player.y - 30, 'Brak celu', '#ffcc00');
        } else {
          const base = this.computeAttackDamage();
          const skillDmg = Math.floor(base * 2.2);
          this.dealDamageToEnemy(target, skillDmg);
          this.showFloatingText(target.x, target.y - 12, `- ${skillDmg} (Q)`, '#ff66ff');
          this.skillCooldownUntil = time + 6000; // 6s cooldown
        }
      }
    }
  }

  handlePickups() {
    // pickup E: szukamy przedmiotu overlapping z graczem
    if (Phaser.Input.Keyboard.JustDown(this.keyE)) {
      const itemSprite = this.itemsOnGround.getChildren().find((it) => {
        const s = it as Phaser.Physics.Arcade.Image & { getData: any };
        const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, s.x, s.y);
        return dist <= 36;
      }) as any;

      if (itemSprite) {
        const item: Item = itemSprite.getData('item');
        if (this.playerData.inventory.length < 12) {
          this.playerData.inventory.push(item);
          this.showFloatingText(this.player.x, this.player.y - 30, `+ ${item.name}`, '#ffee88');
          itemSprite.destroy();
          this.saveGame();
        } else {
          this.showFloatingText(this.player.x, this.player.y - 30, `Ekwipunek pełny`, '#ff4444');
        }
      }
    }
  }

  updateEnemiesBehavior(time: number) {
    // prosta AI: poruszaj się powoli w kierunku gracza
    this.enemies.getChildren().forEach((e) => {
      const enemy = e as Phaser.Physics.Arcade.Sprite & { getData: any };
      const speed = 40 + (enemy.getData('level') || 1) * 6;
      const angle = Phaser.Math.Angle.Between(enemy.x, enemy.y, this.player.x, this.player.y);
      this.physics.velocityFromRotation(angle, speed, enemy.body.velocity);

      // jeżeli blisko gracza, zadaj obrażenia co pewien czas
      const dist = Phaser.Math.Distance.Between(enemy.x, enemy.y, this.player.x, this.player.y);
      if (dist < 28 && (time % 800 < 16)) {
        // enemy hits player
        const edmg = enemy.getData('attack') || 1;
        this.applyDamageToPlayer(edmg);
        this.showFloatingText(this.player.x, this.player.y - 50, `- ${edmg}`, '#ff4444');
      }
    });
  }

  spawnEnemy() {
    const x = Phaser.Math.Between(30, 770);
    const y = Phaser.Math.Between(50, 550);
    const sprite = this.physics.add.sprite(x, y, 'enemy_tex') as any;
    sprite.setCollideWorldBounds(true);
    const hp = Phaser.Math.Between(8, 20);
    const level = Phaser.Math.Between(1, 3);
    const attack = 2 + level;
    sprite.setData('hp', hp);
    sprite.setData('xp', Phaser.Math.Between(6, 16));
    sprite.setData('level', level);
    sprite.setData('attack', attack);
    this.enemies.add(sprite);
  }

  findNearbyEnemy(range: number) {
    return this.enemies.getChildren().find((e) => {
      const enemy = e as Phaser.Physics.Arcade.Sprite & { getData: any };
      const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, enemy.x, enemy.y);
      return dist <= range;
    }) as any;
  }

  computeAttackDamage() {
    const base = this.playerData.baseAttack + (this.playerData.equipment.weapon?.attack || 0);
    // szansa na krytyk 10%
    const crit = Math.random() < 0.1;
    return crit ? Math.floor(base * 1.7) : base;
  }

  dealDamageToEnemy(enemy: any, amount: number) {
    const newHp = enemy.getData('hp') - amount;
    enemy.setData('hp', newHp);
    if (newHp <= 0) {
      const xpGain = enemy.getData('xp') || 5;
      const goldGain = Phaser.Math.Between(5, 18);
      this.enemyDie(enemy, xpGain, goldGain);
    }
  }

  enemyDie(enemy: any, xpGain: number, goldGain: number) {
    this.showFloatingText(enemy.x, enemy.y, 'Zabity!', '#88ff88');
    // szansa na drop
    if (Math.random() < 0.45) {
      const item = this.generateRandomDrop();
      const itSprite = this.physics.add.image(enemy.x, enemy.y, 'item_tex') as any;
      itSprite.setData('item', item);
      this.itemsOnGround.add(itSprite);
    }
    enemy.destroy();
    this.playerData.xp += xpGain;
    this.playerData.gold += goldGain;
    this.showFloatingText(this.player.x, this.player.y - 30, `+${xpGain} XP  +${goldGain} zł`, '#88ccff');
    this.checkLevelUp();
    this.saveGame();
  }

  generateRandomDrop(): Item {
    const r = Math.random();
    if (r < 0.35) {
      return { id: 'potion_small', name: 'Mikstura HP', type: 'consumable', hp: 12, price: 10 };
    } else if (r < 0.7) {
      return { id: `sword_lo_${Date.now()}`, name: 'Topór Chwiejny', type: 'weapon', attack: 2 + Phaser.Math.Between(0, 2), price: 18 };
    } else {
      return { id: `armor_lo_${Date.now()}`, name: 'Tarcza Zardzewiała', type: 'armor', hp: 3 + Phaser.Math.Between(0, 4), price: 20 };
    }
  }

  applyDamageToPlayer(amount: number) {
    const armorBonus = this.playerData.equipment.armor?.hp || 0;
    const final = Math.max(0, amount - Math.floor(armorBonus / 4));
    this.playerData.hp -= final;
    if (this.playerData.hp <= 0) {
      this.playerData.hp = Math.max(1, Math.floor(this.playerData.maxHp / 2));
      this.playerData.gold = Math.max(0, Math.floor(this.playerData.gold / 2));
      this.showFloatingText(this.player.x, this.player.y - 60, 'Zginąłeś! Odbudowano HP i połowę złota', '#ff6666');
      this.saveGame();
    }
  }

  checkLevelUp() {
    const nextXp = this.xpForLevel(this.playerData.level + 1);
    if (this.playerData.xp >= nextXp) {
      this.playerData.level += 1;
      this.playerData.maxHp += 8;
      this.playerData.hp = this.playerData.maxHp;
      this.playerData.baseAttack += 1;
      this.showFloatingText(this.player.x, this.player.y - 50, `Awans! Poziom ${this.playerData.level}`, '#ffee66');
    }
  }

  xpForLevel(lvl: number) {
    return Math.floor(12 * Math.pow(1.55, lvl - 1));
  }

  hudString() {
    const totalAttack = this.playerData.baseAttack + (this.playerData.equipment.weapon?.attack || 0);
    return `HP: ${this.playerData.hp}/${this.playerData.maxHp}   Poziom: ${this.playerData.level}   XP: ${this.playerData.xp}/${this.xpForLevel(this.playerData.level + 1)}   Atak: ${totalAttack}   Złoto: ${this.playerData.gold}`;
  }

  updateInventoryUI() {
    if (!this.invOpen) {
      this.invText.setText('');
      // toggle inventory
      if (Phaser.Input.Keyboard.JustDown(this.keyI)) this.invOpen = true;
      return;
    } else {
      if (Phaser.Input.Keyboard.JustDown(this.keyI)) {
        this.invOpen = false;
        return;
      }
    }

    // inventory open: pokaz listę i możliwości ekwipowania / użycia
    let s = '== Ekwipunek ==\n';
    s += `Broń: ${this.playerData.equipment.weapon?.name || 'Brak'}  Zbroja: ${this.playerData.equipment.armor?.name || 'Brak'}\n\n`;
    s += 'Sloty:\n';
    this.playerData.inventory.forEach((it, idx) => {
      s += `${idx + 1}. ${it.name} (${it.type})\n`;
    });
    s += '\nNaciśnij numer aby użyć/wyekwipować przedmiot.';
    this.invText.setText(s);

    // obsługa numerów dla inventory
    this.numberKeys.forEach((k, i) => {
      if (Phaser.Input.Keyboard.JustDown(k)) {
        const idx = i; // 0-based
        if (idx < this.playerData.inventory.length) {
          const item = this.playerData.inventory[idx];
          this.useOrEquipItem(item, idx);
        }
      }
    });
  }

  useOrEquipItem(item: Item, idx: number) {
    if (item.type === 'consumable') {
      this.playerData.hp = Math.min(this.playerData.maxHp, this.playerData.hp + (item.hp || 0));
      this.showFloatingText(this.player.x, this.player.y - 30, `+ ${item.hp} HP`, '#88ff88');
      this.playerData.inventory.splice(idx, 1);
    } else if (item.type === 'weapon') {
      // equip swap
      const prev = this.playerData.equipment.weapon;
      this.playerData.equipment.weapon = item;
      this.playerData.inventory.splice(idx, 1);
      if (prev) this.playerData.inventory.push(prev);
      this.showFloatingText(this.player.x, this.player.y - 30, `Wyposażono: ${item.name}`, '#ffee88');
    } else if (item.type === 'armor') {
      const prev = this.playerData.equipment.armor;
      this.playerData.equipment.armor = item;
      this.playerData.inventory.splice(idx, 1);
      if (prev) this.playerData.inventory.push(prev);
      this.showFloatingText(this.player.x, this.player.y - 30, `Założono: ${item.name}`, '#ffee88');
    }
    this.saveGame();
  }

  updateShopUI() {
    if (Phaser.Input.Keyboard.JustDown(this.keyB)) {
      this.shopOpen = !this.shopOpen;
      if (!this.shopOpen) this.shopText.setText('');
    }
    if (!this.shopOpen) return;

    let s = '== Sklep ==\n';
    s += 'Naciśnij numer aby kupić (jeśli masz złoto):\n\n';
    this.shopItems.forEach((it, idx) => {
      s += `${idx + 1}. ${it.name} - ${it.price} zł (${it.type})\n`;
    });
    s += '\nB aby zamknąć.';
    this.shopText.setText(s);

    this.numberKeys.forEach((k, i) => {
      if (Phaser.Input.Keyboard.JustDown(k)) {
        if (i < this.shopItems.length) {
          const item = this.shopItems[i];
          if (this.playerData.gold >= (item.price || 0) && this.playerData.inventory.length < 12) {
            this.playerData.gold -= item.price || 0;
            // kupiony item: clone with unique id
            const copy: Item = { ...item, id: `${item.id}_${Date.now()}` };
            this.playerData.inventory.push(copy);
            this.showFloatingText(this.player.x, this.player.y - 30, `Kupiono: ${item.name}`, '#88ff88');
            this.saveGame();
          } else {
            this.showFloatingText(this.player.x, this.player.y - 30, `Brak złota / brak miejsca`, '#ff4444');
          }
        }
      }
    });
  }

  showFloatingText(x: number, y: number, text: string, color = '#ffffff') {
    const t = this.add.text(x, y, text, {
      font: '14px Arial',
      color
    }).setOrigin(0.5);
    this.tweens.add({
      targets: t,
      y: y - 36,
      alpha: 0,
      duration: 900,
      ease: 'Cubic.easeOut',
      onComplete: () => t.destroy()
    });
  }

  saveGame() {
    try {
      const save = {
        hp: this.playerData.hp,
        maxHp: this.playerData.maxHp,
        xp: this.playerData.xp,
        level: this.playerData.level,
        baseAttack: this.playerData.baseAttack,
        gold: this.playerData.gold,
        inventory: this.playerData.inventory,
        equipment: this.playerData.equipment
      };
      localStorage.setItem(SAVE_KEY, JSON.stringify(save));
      // opcjonalnie: wyświetl krótki tekst zapisu (wyciszony)
    } catch (e) {
      console.warn('Nie udało się zapisać gry:', e);
    }
  }

  loadSave() {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (!raw) return;
      const s = JSON.parse(raw);
      // prosty walidator
      if (s && typeof s.hp === 'number') {
        this.playerData.hp = s.hp;
        this.playerData.maxHp = s.maxHp || this.playerData.maxHp;
        this.playerData.xp = s.xp || 0;
        this.playerData.level = s.level || 1;
        this.playerData.baseAttack = s.baseAttack || this.playerData.baseAttack;
        this.playerData.gold = s.gold || this.playerData.gold;
        this.playerData.inventory = s.inventory || [];
        this.playerData.equipment = s.equipment || { weapon: null, armor: null };
      }
    } catch (e) {
      console.warn('Błąd przy odczycie save:', e);
    }
  }
}
