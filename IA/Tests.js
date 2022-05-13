/*import { db, fd, database} from "./DataKeeper.js"
import { ChatManager, tags } from "./ChatManager.js"
import { DataBase, Message } from "./Utils.js"
import { chat } from "./ChatFlow.js"
import { StepStuff } from "./Messages.js"
import { AutoQueue } from "../ExecutionQueue.js"
*/

class Queue {
    constructor() { this._items = []; }
    enqueue(item) { this._items.push(item); }
    dequeue() { return this._items.shift(); }
    get size() { return this._items.length; }
}

class AutoQueue extends Queue {
    constructor() {
        super();
        this._pendingPromise = false;
    }

    enqueue(action) {
        return new Promise((resolve, reject) => {
            super.enqueue({ action, resolve, reject });
            this.dequeue();
        });
    }

    async dequeue() {
        if (this._pendingPromise) return false;
        let item = super.dequeue();
        if (!item) return false;
        try {
            this._pendingPromise = true;
            let payload = await item.action();
            this._pendingPromise = false;
            item.resolve(payload);
        } catch (e) {
            this._pendingPromise = false;
            item.reject(e);
        } finally {
            this.dequeue();
        }
        return true;
    }
}

const q = new AutoQueue()
//let cd = new ChatManager('12')
//let msg = new Message('44')


async function test(){
    q.enqueue(() => new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log('pronto')
            resolve(false)
        }, 2000)
    }))
}
