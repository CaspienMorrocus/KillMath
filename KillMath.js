kaboom({
    global: true,
    fullscreen: true,
    debug: true,
    width: window.innerWidth,
    height: window.innerHeight,
    stretch: true,
    letterbox: true
});
debug.inspect = true;
setBackground(0, 0, 0);

const assetScale = Math.min(width() / 800, height() / 600);
loadRoot("./");

// Load sprites
loadSprite("BackGround", "Assets/background.png");
loadSprite("Table", "Assets/Table.png");
loadSprite("G", "Assets/G.png");
loadSprite("T", "Assets/T.png");
loadSprite("Ata", "Assets/Ata.png");
// Define the main scene
scene("main", () => {
    const bg = add([
        sprite("BackGround"),
        anchor("center"),
        scale(assetScale),
        pos(width() / 2, height() / 2)
    ]);
    const bgLeftEdge = bg.pos.x - bg.width / 2;
    const bgRightEdge = bg.pos.x + bg.width / 2;

    // Add table function that calculates its position consistently
    function addTable(x, y) {
        const t_Position = vec2(
            (width() / 2) + x,
            (height() / 2) + y
        );

        add([  // Add the table with proper position and properties
            "table",
            sprite("Table"),
            anchor("center"),
            scale(assetScale * 0.2),
            area(),
            body(),
            pos(t_Position)
        ]);
    }

    // Add tables with specific offsets
    addTable(-250, 0);
    addTable(-250, 150);
    addTable(250, 0);
    addTable(250, 150);
    addTable(width() / 2 - 470, height() / 2 - 400);

    // Create Gopal sprite
    const Gopal = add([
        "G",
        sprite("G"),
        anchor("center"),
        body(),
        pos(width() / 2, height() / 2 - 160),
        scale(5),
        area(),
        { health: 100 }
    ]);
    const Player = add([
        "player",
        sprite("Ata"),
        anchor("center"),
        body(),
        pos(width() / 2, height() / 2 + 200),
        scale(0.5),
        area(),
        { health: 100 }
    ])

    const SPEED = 200;  // Base speed
    let mult = Math.random() * 2 - 1;  // Initial random multiplier, between -1 and 1

    // Function to update multiplier after a delay
    function updateMultiplier() { 
        mult = Math.random() * 2 - 1;  // Update to a new random multiplier (between -1 and 1)
        if (mult === 0) { // Make sure the multiplier isn't zero
            mult = 0.5;  // Set it to a non-zero value
        }
    }

    // Update the position of Gopal
    onUpdate("G", (g) => {
        // Move Gopal horizontally with the current random speed
        g.move(SPEED * mult, 0);

        // Clamp Gopal's position within the bounds of the background
        g.pos.x = Math.max(bgLeftEdge, Math.min(g.pos.x, bgRightEdge));
        
        // If Gopal goes off-screen to the left, destroy him
        if (g.pos.x <= -width()) {
            destroy(g);
        }
    });

    // Start a repeating timer to update the multiplier every 2 seconds
    loop(2, () => {
        updateMultiplier();  // Update the multiplier every 2 seconds
    });
});

// Start the game with the main scene
go("main");
