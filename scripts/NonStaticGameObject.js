import { GameObject } from "./GameObject.js";

export class NonStaticGameObjects extends GameObject {
    
    update(player, arrayOfObstacles) {

        let collisonObject = [player, ...arrayOfObstacles];
        collisonObject.forEach((obj) => {
          if (obj === this) return;
          const collisionStatus = GameObject.checkCollision(this, obj);
  
          if (collisionStatus.status) {
            const unit_x = collisionStatus.dx / collisionStatus.distance;
            const unit_y = collisionStatus.dy / collisionStatus.distance;
            this.collisionX =
              obj.collisionX + (collisionStatus.sumOfRad + 1) * unit_x;
            this.collisionY =
              obj.collisionY + (collisionStatus.sumOfRad + 1) * unit_y;
          }
        });
    }

}
