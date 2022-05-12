class Queue {
    constructor() {
        this._items = {}
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
            let payload = await item.action(this);
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
}

export { AutoQueue }  