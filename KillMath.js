kaboom({
    global: true,
    fullscreen: true,
    debug: true,
    clearColor: [0, 0, 0, 1]
});

// Load the sprite
loadSprite("BackGround", "background.png");
loadSprite("Table", "Table.png");

// Define the main scene
scene("main", () => {

    add([
        sprite("BackGround"),
        anchor("center"),
        scale(2),
        pos(width()/2, height() / 2)
    ])
    add([
        sprite("Table"),
        anchor("center"),
        scale(0.3),
        pos((width()/2) - 450, (height() / 2) + 250)
    ])
});

// Start the game with the main scene
go("main");