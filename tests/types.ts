import * as borsh from "borsh";

class Counter {
    count: number;

    constructor(props: { count: number }) {
        this.count = props.count;
    }
}

export const schema: borsh.Schema = {
    struct: {
        count: "u32",
    }
}

export const COUNTER_SIZE = borsh.serialize(schema, new Counter({ count: 0 })).length;

console.log(borsh.serialize(schema, new Counter({ count: 1 })));