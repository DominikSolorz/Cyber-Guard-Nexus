import Phaser from 'phaser';

export default class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  preload() {
    // generujemy proste tekstury pixel-like za pomocą Graphics, bez zewnętrznych plików
  }

  create() {
    // utworzenie prostych tekstur: gracz, przeciwnik, item, tło kafla
    const g = this.add.graphics();

    // player texture (zielony)
    g.fillStyle(0x00cc66, 1);
    g.fillRect(0, 0, 28, 36);
    g.generateTexture('player_tex', 28, 36);
    g.clear();

    // enemy texture (czerwony)
    g.fillStyle(0xcc4444, 1);
    g.fillRect(0, 0, 28, 28);
    g.generateTexture('enemy_tex', 28, 28);
    g.clear();

    // item texture (żółty)
    g.fillStyle(0xffcc00, 1);
    g.fillRect(0, 0, 12, 12);
    g.generateTexture('item_tex', 12, 12);
    g.clear();

    // small tile texture (tło)
    g.fillStyle(0x2b2b44, 1);
    g.fillRect(0, 0, 32, 32);
    g.generateTexture('tile_tex', 32, 32);
    g.clear();

    this.scene.start('GameScene');
  }
}
