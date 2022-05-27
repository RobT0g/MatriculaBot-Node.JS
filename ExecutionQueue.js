import { TextSender } from './API_Utils.js'

class Queue {
    constructor() {
        this._items = {}
        this._warned = {}
    }

    enqueue(item, num) { 
        if(!(num in this._items))
            this._items[num] = []
        this._items[num].push(item);
    }

    dequeue(num) { 
        return this._items[num].shift()
    }
}
  
class AutoQueue extends Queue {
    constructor() {
        super();
        this._pendingPromise = {}
    }
  
    enqueue(action, num) {
        return new Promise((resolve, reject) => {
            super.enqueue({ action, resolve, reject }, num);
            this.dequeue(num);
        });
    }
  
    async dequeue(num) {
        if (this._pendingPromise[num]) return false;
        let item = super.dequeue(num);
        if (!item) return false;
        try {
            this._pendingPromise[num] = true;
            let payload = await item.action();
            this._pendingPromise[num] = false;
            item.resolve(payload);
        } catch (e) {
            this._pendingPromise[num] = false;
            item.reject(e);
        } finally {
            this.dequeue(num);
        }
        return true;
    }

    async warnUser(num, client){
        if(this.getSize >= 4 && !(num in this._warned)){
            this.enqueue(() => new Promise(async(resolve, reject) => {
                await TextSender.delivText(['Peço perdão, tem várias pessoas me contatando agora, então talvez eu irei demorar um pouco.'], num, client)
                this._warned[num] = true
            }))
        }
    }

    getSize(){
        return (Object.keys(this._items)).filter(i => i.length > 0).length
    }
}

export { AutoQueue }  