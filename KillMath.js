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
loadSprite("BackGround", "./Assets/background.png");
loadSprite("Table", "./Assets/Table.png");
loadSprite("G", "./Assets/G.png");
loadSprite("T", "./Assets/T.png");
loadSprite("Ata", "./Assets/Ata.png");
loadSound("bgMusic", "bgMusic.mp3")
loadSound("sMusic", "sMusic.mp3") 
loadSound("explosion", "explosion.wav") 

// Define the main scene
scene("easy", () => {

    let playerSpeedMultiplier = 1;
let slowTimer = 0;  
const BASE_SPEED = 200;

// inside onUpdate("player", (p) => { ... })

// Update speed if slowed

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
            scale(assetScale * 0.15),
            area(),
            pos(t_Position),  // Fix the table's position here
            area({ collisionIgnore: [] }),
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
        scale(4),
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
        scale(0.4),
        area(),
        { health: 100 }
    ]);

    const SPEED = 200;  // Base speed
    let mult = Math.random() * 2 - 1;  // Initial random multiplier, between -1 and 1

    
    function updateMultiplier() {
        mult = Math.random() * 2 - 1;  
        if (mult === 0) { 
            mult = 0.5;  
        }
    }

    // Update the position of Gopal
    onUpdate("G", (g) => {
        const dir = Player.pos.sub(g.pos).unit(); // Get direction vector toward player
        g.move(dir.scale(SPEED - 100)); // Move Gopal toward player
    
        // Clamp Gopal's position within the background bounds
        g.pos.x = Math.max(bgLeftEdge, Math.min(g.pos.x, bgRightEdge));
        g.pos.y = Math.max(bgTopEdge, Math.min(g.pos.y, bgBottomEdge));
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
        if (slowTimer > 0) {
            slowTimer -= dt();
            playerSpeedMultiplier = 0.5; 
        } else {
            playerSpeedMultiplier = 1; 
        }
        // Horizontal movement
        if (isKeyDown("left") || isKeyDown("a")) {
            p.move(directions.left.scale(BASE_SPEED * playerSpeedMultiplier)); // Move left
            p.flipX = false; // Ensure the sprite is facing left
            
        } else if (isKeyDown("right") || isKeyDown("d")) {
            p.move(directions.right.scale(BASE_SPEED * playerSpeedMultiplier)); // Move right
            p.flipX = true; // Flip the sprite to face right
          
        }

        // Vertical movement
        if (isKeyDown("up") || isKeyDown("w")) {
            p.move(directions.up.scale(BASE_SPEED * playerSpeedMultiplier)); // Move up
         
        } else if (isKeyDown("down") || isKeyDown("s")) {
            p.move(directions.down.scale(BASE_SPEED * playerSpeedMultiplier)); // Move down
           
        }
        let recentlyShook = false;

        // Restrict the player within the bounds of the background
        p.pos.x = Math.max(bgLeftEdge, Math.min(p.pos.x, bgRightEdge));
        p.pos.y = Math.max(bgTopEdge, Math.min(p.pos.y, bgBottomEdge));
    
        p.onCollide("table", (t) => {
            // Handle the collision (e.g., stop movement, play a sound, etc.)
            console.log(" Collided with table!");
            play("explosion")
            slowTimer = 1;
            // Example: Stop player movement when colliding with a table
            p.pos.x = Math.max(bgLeftEdge, Math.min(p.pos.x, bgRightEdge));
            p.pos.y = Math.max(bgTopEdge, Math.min(p.pos.y, bgBottomEdge));
           

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
scene("hard", () => {
    let playerSpeedMultiplier = 1;
    let slowTimer = 0; 
    const BASE_SPEED = 400;
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
            scale(assetScale * 0.15),
            area(),
            pos(t_Position),  // Fix the table's position here
            area({ collisionIgnore: [] }),
        ]);
    }

    // Add tables with specific offsets 
    addTable(-250, 0);
    addTable(-250, 150);
    addTable(250, 0);
    addTable(250, 150);
    addTable(width() / 2 - 470, height() / 2 - 400);

    // Create Gopal sprite
    const Tans = add([
        "T",
        sprite("T"),
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
        scale(0.4),
        area(),
        { health: 100 }
    ]);

    const SPEED = 400;  
    let mult = Math.random() * 2 - 1;  // Initial random multiplier, between -1 and 1

    // Function to update multiplier after a delay
    function updateMultiplier() {
        mult = Math.random() * 2 - 1;  // Update to a new random multiplier (between -1 and 1)
        if (mult === 0) { // Make sure the multiplier isn't zero
            mult = 0.5;  // Set it to a non-zero value
        }
    }

    // Update the position of Gopal
    onUpdate("T", (t) => {
        const dir = Player.pos.sub(t.pos).unit(); 
        t.move(dir.scale(SPEED - 200)); 
       
        t.pos.x = Math.max(bgLeftEdge, Math.min(t.pos.x, bgRightEdge));
        t.pos.y = Math.max(bgTopEdge, Math.min(t.pos.y, bgBottomEdge));
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
        if (slowTimer > 0) {
            slowTimer -= dt();
            playerSpeedMultiplier = 0.5; 
        } else {
            playerSpeedMultiplier = 1; 
        }
        // Horizontal movement
        if (isKeyDown("left") || isKeyDown("a")) {
            p.move(directions.left.scale(BASE_SPEED * playerSpeedMultiplier)); // Move left
            p.flipX = false; // Ensure the sprite is facing left
            
        } else if (isKeyDown("right") || isKeyDown("d")) {
            p.move(directions.right.scale(BASE_SPEED * playerSpeedMultiplier)); // Move right
            p.flipX = true; // Flip the sprite to face right
          
        }

        // Vertical movement
        if (isKeyDown("up") || isKeyDown("w")) {
            p.move(directions.up.scale(BASE_SPEED * playerSpeedMultiplier)); // Move up
         
        } else if (isKeyDown("down") || isKeyDown("s")) {
            p.move(directions.down.scale(BASE_SPEED * playerSpeedMultiplier)); // Move down
           
        }

        // Restrict the player within the bounds of the background
        p.pos.x = Math.max(bgLeftEdge, Math.min(p.pos.x, bgRightEdge));
        p.pos.y = Math.max(bgTopEdge, Math.min(p.pos.y, bgBottomEdge));
    
        p.onCollide("table", (t) => {
            // Handle the collision (e.g., stop movement, play a sound, etc.)
            play("explosion")
            slowTimer = 1.5;
            // Example: Stop player movement when colliding with a table
            p.pos.x = Math.max(bgLeftEdge, Math.min(p.pos.x, bgRightEdge));
            p.pos.y = Math.max(bgTopEdge, Math.min(p.pos.y, bgBottomEdge));
            
        });
        p.onCollide("T", (t) => {
            // Handle the collision (e.g., stop movement, play a sound, etc.)
            shake(5)
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
        pos(width() / 2, height() / 2 - 50)
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
            go("start");  // Go back to the easy scene
        }
    });
});
scene("start", () => {
    const sMusic = play("sMusic", {
        volume: 1,
        loop: true
    })
    add([
        rect(width(), height()),
        color(0, 1, 1)
    ]);
    add([
        text('KillMath', 16),
        anchor("center"),
        pos(width() / 2, height() / 2 - 75) 
    ]);
    add([
        text('Press the space key to start. or Enter to raise difficulty', 10, {
            width: width() - 50
        }),
        anchor("center"),
        pos(width() / 2, (height() / 2) + 40)
    ]);

    // Continuously check for the space key press
    onUpdate(() => {
        if (isKeyPressed("space")) {
            sMusic.stop()
            go("easy");  // Go back to the easy scene
        }
    });
    onUpdate(() => {
        if (isKeyPressed("enter")) {
            sMusic.stop()
            go("hard");  // Go back to the easy scene
        }
    })
});
// Start the game with the easy scene 
go("easy");   
onUpdate(() => {
    console.log("Current Scene: ", getCurrentScene());
});