(function(){
  // Simple Phaser 3 game adapted from prototype - vanilla JS for static hosting
  const W = Math.max(window.innerWidth, 600);
  const H = Math.max(window.innerHeight, 400);

  const config = {
    type: Phaser.AUTO,
    parent: 'game',
    width: W,
    height: H,
    backgroundColor: '#101020',
    scale: {
      mode: Phaser.Scale.RESIZE,
      autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
      default: 'arcade',
      arcade: { debug: false }
    },
    scene: {
      preload: preload,
      create: create,
      update: update
    }
  };

  const game = new Phaser.Game(config);

  let player, cursors, pointer;
  let enemies, itemsGroup;
  let target = null;
  let hudText;
  let playerData;
  let lastSave = 0;
  let skillCooldown = 0;
  let audioCtx;

  // Simple WebAudio sound generator
  function playSound(freq, duration, type='sine'){
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);
    osc.start(audioCtx.currentTime);
    osc.stop(audioCtx.currentTime + duration);
  }

  function preload() {
    // no external assets - generate textures in create
  }

  function create() {
    // generate textures
    const g = this.add.graphics();
    g.fillStyle(0x00cc66,1); g.fillRect(0,0,28,36); g.generateTexture('player_tex',28,36); g.clear();
    g.fillStyle(0xcc4444,1); g.fillRect(0,0,28,28); g.generateTexture('enemy_tex',28,28); g.clear();
    g.fillStyle(0xffcc00,1); g.fillRect(0,0,12,12); g.generateTexture('item_tex',12,12); g.clear();
    g.fillStyle(0x2b2b44,1); g.fillRect(0,0,32,32); g.generateTexture('tile_tex',32,32); g.clear();

    // tile background
    for (let y=0;y<this.scale.height;y+=32){
      for (let x=0;x<this.scale.width;x+=32){
        this.add.image(x+16,y+16,'tile_tex').setAlpha(0.6);
      }
    }

    // player
    player = this.physics.add.sprite(this.scale.width/2, this.scale.height/2, 'player_tex');
    player.setCollideWorldBounds(true);

    // groups
    enemies = this.physics.add.group();
    itemsGroup = this.physics.add.group();

    // input
    cursors = this.input.keyboard.createCursorKeys();
    this.input.keyboard.addKey('W'); this.input.keyboard.addKey('A'); this.input.keyboard.addKey('S'); this.input.keyboard.addKey('D');

    pointer = this.input.activePointer;
    this.input.on('pointerdown', (p)=>{
      // move toward pointer
      target = { x: p.worldX, y: p.worldY };
    });

    // HUD text
    hudText = this.add.text(10,10,'', { font: '16px Arial', color: '#ffffff' }).setScrollFactor(0).setDepth(10);

    // player data
    playerData = {
      hp: 30, maxHp: 30, xp: 0, level:1, baseAttack:6, gold:20, inventory:[], equipment:{ weapon:null, armor:null }
    };
    loadGame(); // Load saved game if exists

    // spawn enemies
    for (let i=0;i<4;i++) spawnEnemy.call(this);

    // overlap for pickable items
    this.physics.add.overlap(player, itemsGroup, ()=>{}, null, this);

    // on-screen buttons
    setupButtons(game);

    // resize handling: rebuild background tiles on resize
    this.scale.on('resize', (gameSize)=>{
      const width = gameSize.width; const height = gameSize.height;
      // naive: clear and recreate background
      this.children.removeAll();
      // regenerate textures may still be present; re-add tile background
      for (let y=0;y<height;y+=32){
        for (let x=0;x<width;x+=32){
          this.add.image(x+16,y+16,'tile_tex').setAlpha(0.6);
        }
      }
      // re-add hud and controls sprites (not perfect, but enough for prototype)
      this.add.existing(player);
      enemies.getChildren().forEach(e=> this.add.existing(e));
      itemsGroup.getChildren().forEach(it=> this.add.existing(it));
      hudText.setText(hudString());
    });
  }

  function update(time, delta) {
    const speed = 160;

    // keyboard movement priority
    let vx = 0, vy = 0;
    if (cursors.left.isDown) vx = -speed; else if (cursors.right.isDown) vx = speed;
    if (cursors.up.isDown) vy = -speed; else if (cursors.down.isDown) vy = speed;

    if (vx !==0 || vy !==0){
      player.body.setVelocity(vx, vy);
      if (vx!==0 && vy!==0) player.body.setVelocity(vx*0.707, vy*0.707);
      target = null;
    } else if (target){
      // move toward target
      const angle = Phaser.Math.Angle.Between(player.x, player.y, target.x, target.y);
      this.physics.velocityFromRotation(angle, speed, player.body.velocity);
      const dist = Phaser.Math.Distance.Between(player.x, player.y, target.x, target.y);
      if (dist < 8) { player.body.setVelocity(0,0); target = null; }
    } else {
      player.body.setVelocity(0,0);
    }

    // enemies AI: move toward player
    enemies.getChildren().forEach(e=>{
      const enemy = e;
      const speedE = 40 + (enemy.getData('level')||1)*6;
      const angle = Phaser.Math.Angle.Between(enemy.x, enemy.y, player.x, player.y);
      this.physics.velocityFromRotation(angle, speedE, enemy.body.velocity);
      // damage on touch
      const dist = Phaser.Math.Distance.Between(enemy.x, enemy.y, player.x, player.y);
      if (dist < 28 && (time % 800 < delta)){
        const dmg = enemy.getData('attack')||1;
        applyDamageToPlayer(dmg);
        showFloatingText.call(this, player.x, player.y-40, `- ${dmg}`, '#ff4444');
      }
    });

    // update HUD and autosave
    hudText.setText(hudString());
    if (time - lastSave > 5000){ saveGame(); lastSave = time; }

    // skill cooldown visual update handled via buttons
  }

  function spawnEnemy(){
    const x = Phaser.Math.Between(40, this.scale.width-40);
    const y = Phaser.Math.Between(60, this.scale.height-60);
    const s = this.physics.add.sprite(x,y,'enemy_tex');
    s.setCollideWorldBounds(true);
    const hp = Phaser.Math.Between(8,18);
    const level = Phaser.Math.Between(1,3);
    const attack = 2 + level;
    s.setData('hp', hp); s.setData('xp', Phaser.Math.Between(6,16)); s.setData('level', level); s.setData('attack', attack);
    enemies.add(s);
  }

  function findNearbyEnemy(range){
    return enemies.getChildren().find(e=>{
      const dist = Phaser.Math.Distance.Between(player.x, player.y, e.x, e.y);
      return dist <= range;
    });
  }

  function computeAttackDamage(){
    const base = playerData.baseAttack + (playerData.equipment.weapon?playerData.equipment.weapon.attack:0);
    const crit = Math.random() < 0.1; return crit?Math.floor(base*1.7):base;
  }

  function dealDamageToEnemy(enemy, amount){
    playSound(300, 0.1, 'square'); // attack sound
    const newHp = enemy.getData('hp') - amount; enemy.setData('hp', newHp);
    if (newHp <= 0){
      playSound(150, 0.3, 'sawtooth'); // death sound
      const xp = enemy.getData('xp')||5; const gold = Phaser.Math.Between(5,18);
      enemy.destroy();
      playerData.xp += xp; playerData.gold += gold;
      showFloatingText.call(this, player.x, player.y-30, `+${xp} XP +${gold} zł`, '#88ccff');
      // drop
      if (Math.random() < 0.45){
        const item = generateRandomDrop();
        const it = this.physics.add.image(enemy.x, enemy.y, 'item_tex'); it.setData('item', item); itemsGroup.add(it);
      }
      checkLevelUp.call(this);
      saveGame();
    }
  }

  function applyDamageToPlayer(amount){
    playSound(200, 0.15, 'triangle'); // player hurt sound
    const armor = playerData.equipment.armor?playerData.equipment.armor.hp:0;
    const final = Math.max(0, amount - Math.floor(armor/4));
    playerData.hp -= final; if (playerData.hp <= 0){ playerData.hp = Math.max(1, Math.floor(playerData.maxHp/2)); playerData.gold = Math.max(0, Math.floor(playerData.gold/2)); showFloatingText.call(this, player.x, player.y-60, 'Zginąłeś! Odbudowano HP i połowę złota', '#ff6666'); saveGame(); }
  }

  function checkLevelUp(){
    const next = xpForLevel(playerData.level+1); if (playerData.xp >= next){ playerData.level++; playerData.maxHp += 8; playerData.hp = playerData.maxHp; playerData.baseAttack += 1; playSound(600, 0.4, 'sine'); showFloatingText.call(this, player.x, player.y-50, `Awans! Poziom ${playerData.level}`, '#ffee66'); }
  }

  function xpForLevel(lvl){ return Math.floor(12*Math.pow(1.55,lvl-1)); }

  function hudString(){ const total = playerData.baseAttack + (playerData.equipment.weapon?playerData.equipment.weapon.attack:0); return `HP: ${playerData.hp}/${playerData.maxHp}  Poziom: ${playerData.level}  XP: ${playerData.xp}/${xpForLevel(playerData.level+1)}  Atak: ${total}  Złoto: ${playerData.gold}`; }

  function showFloatingText(x,y,text,color){ const scene = game.scene.keys[Object.keys(game.scene.keys)[0]]; const t = scene.add.text(x,y,text,{ font:'14px Arial', color: color||'#fff' }).setOrigin(0.5); scene.tweens.add({ targets:t, y:y-36, alpha:0, duration:900, ease:'Cubic.easeOut', onComplete: ()=>t.destroy() }); }

  function generateRandomDrop(){ if (Math.random()<0.35) return { id:'potion_small', name:'Mikstura HP', type:'consumable', hp:12, price:10 }; else if (Math.random()<0.7) return { id:`sword_${Date.now()}`, name:'Topór Chwiejny', type:'weapon', attack:2+Phaser.Math.Between(0,2), price:18 }; else return { id:`armor_${Date.now()}`, name:'Tarcza Zardzewiała', type:'armor', hp:3+Phaser.Math.Between(0,4), price:20 } }

  function saveGame(){ try{ const save={ hp:playerData.hp, maxHp:playerData.maxHp, xp:playerData.xp, level:playerData.level, baseAttack:playerData.baseAttack, gold:playerData.gold, inventory:playerData.inventory, equipment:playerData.equipment }; localStorage.setItem('margonem_static_save_v1', JSON.stringify(save)); }catch(e){ console.warn('Save failed',e); } }

  function loadGame(){ try{ const raw=localStorage.getItem('margonem_static_save_v1'); if (!raw) return; const s=JSON.parse(raw); if (s && typeof s.hp==='number'){ Object.assign(playerData, { hp:s.hp, maxHp:s.maxHp||playerData.maxHp, xp:s.xp||0, level:s.level||1, baseAttack:s.baseAttack||playerData.baseAttack, gold:s.gold||playerData.gold, inventory:s.inventory||[], equipment:s.equipment||{weapon:null,armor:null} }); } }catch(e){ console.warn('Load failed',e); } }

  // UI buttons behavior
  function setupButtons(game){
    const attackBtn = document.getElementById('attackBtn');
    const skillBtn = document.getElementById('skillBtn');
    const pickupBtn = document.getElementById('pickupBtn');
    const invBtn = document.getElementById('invBtn');
    const shopBtn = document.getElementById('shopBtn');
    const overlay = document.getElementById('overlay');
    const panel = document.getElementById('panel');

    attackBtn.addEventListener('click', ()=>{
      const enemy = findNearbyEnemy(48); if (!enemy){ showFloatingText(player.x, player.y-30, 'Brak celu', '#ffcc00'); } else { const dmg = computeAttackDamage(); dealDamageToEnemy.call(game.scene.scenes[0], enemy, dmg); showFloatingText.call(game.scene.scenes[0], enemy.x, enemy.y-12, `-${dmg}`, '#ff4444'); }
    });

    skillBtn.addEventListener('click', ()=>{
      const now = Date.now(); if (now < skillCooldown){ const remaining = Math.ceil((skillCooldown-now)/1000); showFloatingText.call(game.scene.scenes[0], player.x, player.y-40, `Cd: ${remaining}s`, '#ffbb66'); return; }
      const enemy = findNearbyEnemy(80); if (!enemy){ showFloatingText.call(game.scene.scenes[0], player.x, player.y-30, 'Brak celu', '#ffcc00'); } else { playSound(400, 0.25, 'square'); const base = computeAttackDamage(); const dmg = Math.floor(base*2.2); dealDamageToEnemy.call(game.scene.scenes[0], enemy, dmg); showFloatingText.call(game.scene.scenes[0], enemy.x, enemy.y-12, `- ${dmg} (Q)`, '#ff66ff'); skillCooldown = now + 6000; }
    });

    pickupBtn.addEventListener('click', ()=>{
      // pick nearest item
      const items = Array.from(game.scene.scenes[0].itemsOnGround ? game.scene.scenes[0].itemsOnGround.getChildren() : itemsGroup.getChildren());
      const nearby = items.find(it => Phaser.Math.Distance.Between(player.x, player.y, it.x, it.y) <= 36);
      if (nearby){ playSound(450, 0.2, 'sine'); const item = nearby.getData('item'); if (playerData.inventory.length<12){ playerData.inventory.push(item); nearby.destroy(); showFloatingText(player.x, player.y-30, `+ ${item.name}`, '#ffee88'); saveGame(); } else { showFloatingText(player.x, player.y-30, 'Ekwipunek pełny','#ff4444'); } } else { showFloatingText(player.x, player.y-30, 'Brak przedmiotu','#ffcc00'); }
    });

    invBtn.addEventListener('click', ()=>{
      showPanel('Ekwipunek', inventoryContent());
    });

    shopBtn.addEventListener('click', ()=>{
      showPanel('Sklep', shopContent());
    });

    function showPanel(title, html){ overlay.classList.remove('hidden'); panel.classList.remove('hidden'); panel.innerHTML = `<h2>${title}</h2>${html}<div style="text-align:right;margin-top:8px"><button id=closePanel>Zamknij</button></div>`; document.getElementById('closePanel').addEventListener('click', ()=>{ overlay.classList.add('hidden'); panel.classList.add('hidden'); }); }

    function inventoryContent(){ let s = `<p>Broń: ${playerData.equipment.weapon?playerData.equipment.weapon.name:'Brak'}<br/>Zbroja: ${playerData.equipment.armor?playerData.equipment.armor.name:'Brak'}</p>`; s += '<ul>'; playerData.inventory.forEach((it,idx)=> s+=`<li>${idx+1}. ${it.name} (${it.type}) <button data-i="${idx}" class="useItem">Użyj</button></li>`); s+='</ul>'; return s; }

    function shopContent(){ const shop=[{ id:'sword_1', name:'Miecz Żelazny', type:'weapon', attack:3, price:30 },{ id:'armor_1', name:'Skórzana Kirys', type:'armor', hp:6, price:28 },{ id:'potion_1', name:'Mikstura HP', type:'consumable', hp:10, price:12 }]; let s = `<p>Złoto: ${playerData.gold}</p><ul>`; shop.forEach((it,idx)=> s+=`<li>${idx+1}. ${it.name} - ${it.price} zł <button data-shop="${idx}" class="buyBtn">Kup</button></li>`); s+='</ul>'; setTimeout(()=>{ document.querySelectorAll('.buyBtn').forEach(b=> b.addEventListener('click', (ev)=>{ const idx = parseInt(b.getAttribute('data-shop')); const item = [{ id:'sword_1', name:'Miecz Żelazny', type:'weapon', attack:3, price:30 },{ id:'armor_1', name:'Skórzana Kirys', type:'armor', hp:6, price:28 },{ id:'potion_1', name:'Mikstura HP', type:'consumable', hp:10, price:12 }][idx]; if (playerData.gold >= item.price && playerData.inventory.length<12){ playSound(500, 0.2, 'sine'); playerData.gold -= item.price; playerData.inventory.push(Object.assign({}, item, { id: item.id + '_' + Date.now() })); showFloatingText.call(game.scene.scenes[0], player.x, player.y-30, `Kupiono: ${item.name}`, '#88ff88'); saveGame(); panel.querySelector('p').innerText = `Złoto: ${playerData.gold}`; } else { showFloatingText.call(game.scene.scenes[0], player.x, player.y-30, `Brak złota / brak miejsca`, '#ff4444'); } })); },10); return s; }

    // delegated handler for use buttons inside panel
    document.addEventListener('click', function(e){ if (e.target && e.target.classList.contains('useItem')){ const idx = parseInt(e.target.getAttribute('data-i')); const item = playerData.inventory[idx]; if (!item) return; if (item.type==='consumable'){ playerData.hp = Math.min(playerData.maxHp, playerData.hp + (item.hp||0)); playerData.inventory.splice(idx,1); showFloatingText(player.x, player.y-30, `+ ${item.hp} HP`, '#88ff88'); saveGame(); panel.querySelector('ul').removeChild(e.target.parentElement); } else if (item.type==='weapon'){ const prev = playerData.equipment.weapon; playerData.equipment.weapon = item; playerData.inventory.splice(idx,1); if (prev) playerData.inventory.push(prev); showFloatingText(player.x, player.y-30, `Wyposażono: ${item.name}`, '#ffee88'); saveGame(); } else if (item.type==='armor'){ const prev = playerData.equipment.armor; playerData.equipment.armor = item; playerData.inventory.splice(idx,1); if (prev) playerData.inventory.push(prev); showFloatingText(player.x, player.y-30, `Założono: ${item.name}`, '#ffee88'); saveGame(); } }
    });

  }

})();
