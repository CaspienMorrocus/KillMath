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
    wait(3)
    let playerSpeedMultiplier = 1;
    let slowTimer = 0;  
    const BASE_SPEED = 200;

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

    function addTable(x, y) {
        const t_Position = vec2(
            (width() / 2) + x,
            (height() / 2) + y
        );
    
        add([
            "table",
            sprite("Table"),
            anchor("center"),
            scale(assetScale * 0.15),
            area(),
            pos(t_Position),
            area({ collisionIgnore: [] }),
        ]);
    }

    addTable(-250, 0);
    addTable(-250, 150);
    addTable(250, 0);
    addTable(250, 150);
    addTable(width() / 2 - 470, height() / 2 - 400);

    // Create Gopal with health property
    const Gopal = add([
        "G",
        sprite("G"),
        anchor("center"),
        body(),
        pos(width() / 2, height() / 2 - 160),
        scale(4),
        area(),
        { 
            health: 100,
            maxHealth: 100
        }
    ]);

    // Create health bar for Gopal
    const gopalHealthBarBg = add([
        rect(80, 10),
        pos(Gopal.pos.x - 40, Gopal.pos.y - 50),
        color(255, 0, 0),
        fixed(),
        z(100)
    ]);
    
    const gopalHealthBar = add([
        rect(80, 10),
        pos(Gopal.pos.x - 40, Gopal.pos.y - 50),
        color(0, 255, 0),
        fixed(),
        z(100)
    ]);

    // Update health bar position
    onUpdate(() => {
        gopalHealthBarBg.pos = vec2(Gopal.pos.x - 40, Gopal.pos.y - 70);
        gopalHealthBar.pos = vec2(Gopal.pos.x - 40, Gopal.pos.y - 70);
        gopalHealthBar.width = (Gopal.health / Gopal.maxHealth) * 80;
    });

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

    const SPEED = 200;
    let mult = Math.random() * 2 - 1;

    function updateMultiplier() {
        mult = Math.random() * 2 - 1;  
        if (mult === 0) { 
            mult = 0.5;  
        }
    }

    onUpdate("G", (g) => {
        const dir = Player.pos.sub(g.pos).unit();
        g.move(dir.scale(SPEED - 100));
        g.pos.x = Math.max(bgLeftEdge, Math.min(g.pos.x, bgRightEdge));
        g.pos.y = Math.max(bgTopEdge, Math.min(g.pos.y, bgBottomEdge));
    });

    const directions = {
        "right": vec2(1, 0), 
        "left": vec2(-1, 0),
        "up": vec2(0, -1),
        "down": vec2(0, 1),
    };

    onUpdate("player", (p) => {
        if (slowTimer > 0) {
            slowTimer -= dt();
            playerSpeedMultiplier = 0.5; 
        } else {
            playerSpeedMultiplier = 1; 
        }
        if (isKeyDown("left") || isKeyDown("a")) {
            p.move(directions.left.scale(BASE_SPEED * playerSpeedMultiplier));
            p.flipX = false;
        } else if (isKeyDown("right") || isKeyDown("d")) {
            p.move(directions.right.scale(BASE_SPEED * playerSpeedMultiplier));
            p.flipX = true;
        }

        if (isKeyDown("up") || isKeyDown("w")) {
            p.move(directions.up.scale(BASE_SPEED * playerSpeedMultiplier));
        } else if (isKeyDown("down") || isKeyDown("s")) {
            p.move(directions.down.scale(BASE_SPEED * playerSpeedMultiplier));
        }
        
        p.pos.x = Math.max(bgLeftEdge, Math.min(p.pos.x, bgRightEdge));
        p.pos.y = Math.max(bgTopEdge, Math.min(p.pos.y, bgBottomEdge));
    
        p.onCollide("table", (t) => {
            console.log("Collided with table!");
            play("explosion")
            slowTimer = 1;
            p.pos.x = Math.max(bgLeftEdge, Math.min(p.pos.x, bgRightEdge));
            p.pos.y = Math.max(bgTopEdge, Math.min(p.pos.y, bgBottomEdge));
        });
        
        p.onCollide("G", (g) => {
            console.log("Collided with Gopal!");
            music.stop()
            go("gameover") 
        });
    }); 

    loop(2, () => {
        updateMultiplier();
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

    function addTable(x, y) {
        const t_Position = vec2(
            (width() / 2) + x,
            (height() / 2) + y
        );
    
        add([
            "table",
            sprite("Table"),
            anchor("center"),
            scale(assetScale * 0.15),
            area(),
            pos(t_Position),
            area({ collisionIgnore: [] }),
        ]);
    }

    addTable(-250, 0);
    addTable(-250, 150);
    addTable(250, 0);
    addTable(250, 150);
    addTable(width() / 2 - 470, height() / 2 - 400);

    // Create Tans with health property
    const Tans = add([
        "T",
        sprite("T"),
        anchor("center"),
        body(),
        pos(width() / 2, height() / 2 - 160),
        scale(5),
        area(),
        { 
            health: 150,
            maxHealth: 150
        }
    ]);

    // Create health bar for Tans
    const tansHealthBarBg = add([
        rect(80, 10),
        pos(Tans.pos.x - 40, Tans.pos.y - 50),
        color(255, 0, 0),
        fixed(),
        z(100)
    ]);
    
    const tansHealthBar = add([
        rect(80, 10),
        pos(Tans.pos.x - 40, Tans.pos.y - 50),
        color(0, 255, 0),
        fixed(),
        z(100)
    ]);

    // Update health bar position
    onUpdate(() => {
        tansHealthBarBg.pos = vec2(Tans.pos.x - 40, Tans.pos.y - 70);
        tansHealthBar.pos = vec2(Tans.pos.x - 40, Tans.pos.y - 70);
        tansHealthBar.width = (Tans.health / Tans.maxHealth) * 80;
    });

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
    let mult = Math.random() * 2 - 1;

    function updateMultiplier() {
        mult = Math.random() * 2 - 1;
        if (mult === 0) {
            mult = 0.5;
        }
    }

    onUpdate("T", (t) => {
        const dir = Player.pos.sub(t.pos).unit(); 
        t.move(dir.scale(SPEED - 200)); 
        t.pos.x = Math.max(bgLeftEdge, Math.min(t.pos.x, bgRightEdge));
        t.pos.y = Math.max(bgTopEdge, Math.min(t.pos.y, bgBottomEdge));
    });

    const directions = {
        "right": vec2(1, 0),
        "left": vec2(-1, 0),
        "up": vec2(0, -1),
        "down": vec2(0, 1),
    };

    onUpdate("player", (p) => {
        if (slowTimer > 0) {
            slowTimer -= dt();
            playerSpeedMultiplier = 0.5; 
        } else {
            playerSpeedMultiplier = 1; 
        }
        if (isKeyDown("left") || isKeyDown("a")) {
            p.move(directions.left.scale(BASE_SPEED * playerSpeedMultiplier));
            p.flipX = false;
        } else if (isKeyDown("right") || isKeyDown("d")) {
            p.move(directions.right.scale(BASE_SPEED * playerSpeedMultiplier));
            p.flipX = true;
        }

        if (isKeyDown("up") || isKeyDown("w")) {
            p.move(directions.up.scale(BASE_SPEED * playerSpeedMultiplier));
        } else if (isKeyDown("down") || isKeyDown("s")) {
            p.move(directions.down.scale(BASE_SPEED * playerSpeedMultiplier));
        }

        p.pos.x = Math.max(bgLeftEdge, Math.min(p.pos.x, bgRightEdge));
        p.pos.y = Math.max(bgTopEdge, Math.min(p.pos.y, bgBottomEdge));
    
        p.onCollide("table", (t) => {
            play("explosion")
            slowTimer = 1.5;
            p.pos.x = Math.max(bgLeftEdge, Math.min(p.pos.x, bgRightEdge));
            p.pos.y = Math.max(bgTopEdge, Math.min(p.pos.y, bgBottomEdge));
        });
        p.onCollide("T", (t) => {
            shake(5)
            music.stop()
            go("gameover")
        })
    }); 

    loop(2, () => {
        updateMultiplier();
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

    onUpdate(() => {
        if (isKeyPressed("space")) {
            go("start");
        }
    });
});

scene("start", () => {
    onTouchStart(() => kaboom.resumeAudioContext());
    onTouchMove((pos) => {
        Player.pos = pos;
    });
    
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

    onUpdate(() => {
        if (isKeyPressed("space")) {
            sMusic.stop()
            go("easy"); 
        }
    });
    onUpdate(() => {
        if (isKeyPressed("enter")) {
            sMusic.stop()
            go("hard");  
        }
    })
});

go("start");   
mouseClick(() => {
    kaboom.resumeAudioContext();
})
onUpdate(() => {
    console.log("Current Scene: ", getCurrentScene());
});
onUpdate(() => {
    console.log("Checking if space is pressed");
    if (isKeyPressed("space")) {
        console.log("Space pressed, going to easy scene");
        go("easy");  
    }
});