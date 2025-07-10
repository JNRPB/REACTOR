const enemyA = {
    name: "enemyA",
    color:  " #6bd675 " ,
    size: 20,
    speed: 1.0,
    border: '1px solid #6bd675  ',
    weight: 5
};

enemyA.hp = enemyA.size * 2;
window.enemyA = enemyA;

const enemyB = {
    name: "enemyB",
    color:  " #6bd6b4 " ,
    size: 26,
    speed: 1.5,
    border: '1px solid #6bd6b4 ',
    weight: 3
}

enemyB.hp = enemyB.size * 2;
window.enemyB = enemyB;

const enemyC = {
        name: "enemyC",
    color:  "#604ec7 " ,
    size: 50,
    speed: 1.8,
    border: '1px solid #604ec7 ',
    weight: 1
}

enemyC.hp = enemyC.size * 4;
window.enemyC = enemyC;