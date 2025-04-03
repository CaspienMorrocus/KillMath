kaboom({
    global: true,
    fullscreen: true,
    debug: true,
    width: window.innerWidth,
    height: window.innerHeight,
    stretch: true,
    letterbox: true
});

setBackground(0, 0, 0);

const assetScale = Math.min(width() / 800, height() / 600);

// Load sprites
loadSprite("BackGround", "background.png");
loadSprite("Table", "Table.png");

let table; // Declare table globally

// Define the main scene
scene("main", () => {
    const bg = add([
        sprite("BackGround"),
        anchor("center"),
        scale(assetScale),
        pos(width() / 2, height() / 2)
    ]);

    // First, add the table at a temporary position
    table = add([
        sprite("Table"),
        anchor("center"),
        scale(assetScale * 0.2),
        pos(0, 0) // Temporary position
    ]);

    // Now that table exists, we can correctly position it
    table.pos = vec2(
        bg.pos.x - (bg.width * bg.scale.x) / 2 + (table.width * table.scale.x) / 2, // Left edge of BG + half table width
        bg.pos.y + (bg.height * bg.scale.y) / 2 - (table.height * table.scale.y) / 2 // Bottom edge of BG - half table height
    );
});

// Start the game with the main scene
go("main");