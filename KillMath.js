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
loadRoot("./");

// Load sprites
loadSprite("BackGround", "Assets/background.png");
loadSprite("Table", "Assets/Table.png");
loadSprite("Gopal", "Assets/Gopal.png");
loadSprite("Tansra", "Assets/Tansra.png");

let table; // Declare table globally

// Define the main scene
scene("main", () => {
    const bg = add([
        sprite("BackGround"),
        anchor("center"),
        scale(assetScale),
        pos(width() / 2, height() / 2)
    ]);

    // Add table function that calculates its position consistently
    function addTable(x, y) {
        table = add([
            "table",
            sprite("Table"),
            anchor("center"),
            scale(assetScale * 0.2), // Adjust scale here
            area() // To make the table interactable (optional)
        ]);
    
        // Calculate position based on screen size for consistent results
        table.pos = vec2(
            (width() / 2) + x, // Adjusted to center + offset
            (height() / 2) + y  // Adjusted to center + offset
        );
    }

    // Add two tables with specific offsets
    addTable(-200, 0);
    addTable(-200, 100);

    // Capture mouse clicks and log coordinates
    add([
        "gopal",
        sprite("Gopal"),
        anchor("center"),
        pos(width()/2, height()/2 - 160),
        scale(5),
        area()
    ])
});

// Start the game with the main scene
go("main");
