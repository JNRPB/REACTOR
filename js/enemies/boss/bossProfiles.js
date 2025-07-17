import { sentinelBehavior } from "./bosses/sentinelBehavior.js";

export const bossList = [
  {
    name: "Sentinel",
    color: "darkred",
    maxHp: 7000,
    primaryMove: "horde",
    drop: "voltaicStorm",
    introMessage: "The Overlord descends!",
    width: 100,
    height: 100,
    top: -100,
    border: "3px solid black",
    borderRadius: "10px",
    position: "absolute",
    abilities: {
      initBehavior: sentinelBehavior,
    }
    
  }
];

