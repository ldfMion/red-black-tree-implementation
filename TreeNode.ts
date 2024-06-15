export enum Colors {
	Red,
	Black,
}

export type NodeOrNull = TreeNode | null;

/**
    *  Node for use in a Red-Black Tree
    *  - Provides string representation that shows color
    *  - Since color of an inserted node is initially red, it is initialized automatically here
    *  - The algorithms follow the ones provided in the Red Black tree slides, except for the naming,
    *  since I chose to use more descriptive naming for my own understanding of the methods
    */
export default class TreeNode {
    
    left: NodeOrNull = null;
    right: NodeOrNull = null;
    parent: NodeOrNull = null;
    color: Colors = Colors.Red;
    // creates a node with provided key
    constructor(public key: number) {}
    toString(color?: boolean): string {
        if(color){
            return `<${this.key}${this.colorRep()}>`;
        } else {
            return `${this.key},`
        }
    }
    // returns representation of node color
    private colorRep(): string {
        if (this.color === Colors.Black) {
            return "b";
        } else {
            return "r";
        }
    }
}