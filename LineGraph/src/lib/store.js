import Pubsub from "./pubsub.js";

export default class Store {
  constructor(params) {
    let self = this;

    self.actions = {};
    self.mutations = {};
    self.state = {};
    self.status = "resting";

    self.events = new Pubsub();

    if (params.hasOwnProperty("actions")) {
      self.actions = params.actions;
    }

    if (params.hasOwnProperty("mutations")) {
      self.mutations = params.mutations;
    }

    self.state = new Proxy(params.state || {}, {
      set: function (state, key, value) {
        state[key] = value;

        console.log(`stateChange: ${key}: ${value}`);

        self.events.publish("stateChange", self.state);

        //mutation을 사용하지 않고 state를 변경하려 할경우 warn을 생성
        if (self.status !== "mutation") {
          console.warn(`You should use a mutation to set ${key}`);
          self.status = "resting";
        }

        return true;
      },
    });
  }
  dispatch(actionKey, payload) {
    let self = this;

    if (typeof self.actions[actionKey] !== "function") {
      console.error(`Action "${actionKey}" doesn't exist.`);
      return false;
    }

    console.groupCollapsed(`ACTION: ${actionKey}`);

    self.status = "action";
    self.actions[actionKey](self, payload);

    console.groupEnd();

    return true;
  }

  commit(mutationKey, payload) {
    let self = this;

    if (typeof self.mutations[mutationKey] !== "function") {
      console.log(`Mutation "${mutationKey}" doesn't exist`);
      return false;
    }

    self.status = "mutation";

    let newState = self.mutations[mutationKey](self.state, payload);

    //액션과 다르게 기존 state에 변화를 줌
    self.state = Object.assign(self.state, newState);

    self.status = "resting";

    return true;
  }
}
