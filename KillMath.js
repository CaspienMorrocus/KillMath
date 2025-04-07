kaboom({
    global: true,
    fullscreen: true,
    debug: true,
    width: window.innerWidth,
    height: window.innerHeight,
    stretch: true,
    letterbox: true
});
debug.inspect = false;
setBackground(0, 0, 0);

const assetScale = Math.min(width() / 800, height() / 600);
loadRoot("./");

// Load sprites
loadSprite("BackGround", "Assets/background.png");
loadSprite("Table", "Assets/Table.png");
loadSprite("G", "Assets/G.png");
loadSprite("T", "Assets/T.png");
loadSprite("Ata", "Assets/Ata.png");
loadSound("bgMusic", "bgMusic.mp3")

// Define the main scene
scene("main", () => {
    const music = play("bgMusic", {
        volume: 1,
        loop: true
    })
    const bg = add([
        sprite("BackGround"),
        anchor("center"),
        scale(assetScale),
        pos(width() / 2, height() / 2)
    ]);
    const bgLeftEdge = bg.pos.x - bg.width / 2;
    const bgRightEdge = bg.pos.x + bg.width / 2;
    const bgTopEdge = bg.pos.y - bg.height / 2;
    const bgBottomEdge = bg.pos.y + bg.height / 2;

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
            pos(t_Position),  // Fix the table's position here
            area()
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

    // Create Player sprite
    const Player = add([
        "player",
        sprite("Ata"),
        anchor("center"),
        body(),
        pos(width() / 2, height()/2 + 200),
        scale(0.5),
        area(),
        { health: 100 }
    ]);

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
        g.pos.y = Math.max(bgTopEdge, Math.min(g.pos.y, bgBottomEdge));
        // If Gopal goes off-screen to the left, destroy him
        if (g.pos.x <= -width()) {
            destroy(g);
        }
    });

    // Define movement directions
    const directions = {
        "right": vec2(1, 0),
        "left": vec2(-1, 0),
        "up": vec2(0, -1),
        "down": vec2(0, 1),
    };

    // Handle player movement using key presses
    onUpdate("player", (p) => {
        // Horizontal movement
        if (isKeyDown("left") || isKeyDown("a")) {
            p.move(directions.left.scale(SPEED)); // Move left
        } else if (isKeyDown("right") || isKeyDown("d")) {
            p.move(directions.right.scale(SPEED)); // Move right
        }

        // Vertical movement
        if (isKeyDown("up") || isKeyDown("w")) {
            p.move(directions.up.scale(SPEED)); // Move up
        } else if (isKeyDown("down") || isKeyDown("s")) {
            p.move(directions.down.scale(SPEED)); // Move down
        }

        // Restrict the player within the bounds of the background
        p.pos.x = Math.max(bgLeftEdge, Math.min(p.pos.x, bgRightEdge));
        p.pos.y = Math.max(bgTopEdge, Math.min(p.pos.y, bgBottomEdge));
    
        p.onCollide("table", (t) => {
            // Handle the collision (e.g., stop movement, play a sound, etc.)
            console.log(" Collided with table!");
            // Example: Stop player movement when colliding with a table
            p.pos.x = Math.max(bgLeftEdge, Math.min(p.pos.x, bgRightEdge));
            p.pos.y = Math.max(bgTopEdge, Math.min(p.pos.y, bgBottomEdge));
            shake(60)
        });
        p.onCollide("G", (g) => {
            // Handle the collision (e.g., stop movement, play a sound, etc.)
            console.log(" Collided with Gopal! ");
            // Example: Stop player movement when colliding with a table
            music.stop()
            go("gameover")
        })
    }); 

    // Start a repeating timer to update the multiplier every 2 seconds
    loop(2, () => {
        updateMultiplier();  // Update the  multiplier every 2 seconds
    });
});
scene("gameover", () => {
    add([
        rect(width(), height()),
        color(0, 0, 0)
    ]);
    add([
        text('Game Over', 16),
        anchor("center"),
        pos(width() / 2, height() / 2)
    ]);
    add([
        text('Press the space key to start over', 10, {
            width: width() - 50
        }),
        anchor("center"),
        pos(width() / 2, (height() / 2) + 40)
    ]);

    // Continuously check for the space key press
    onUpdate(() => {
        if (isKeyPressed("space")) {
            go("main");  // Go back to the main scene
        }
    });
});
// Start the game with the main scene 
go("main");   
