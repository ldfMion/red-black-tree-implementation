import TreeNode, { Colors, NodeOrNull } from "./TreeNode";

/**
 * Red Black Tree implementation
 */
class RBTree {
	private root: NodeOrNull = null;
	constructor() {}

	// PUBLIC METHODS

	/**
	 * Represents tree as a string with choice of traversal mode
	 */
	public toString(mode?: "level" | "pre" | "in" | "post"): string {
		let nodeList: TreeNode[] = [];
		let color = false;
		switch (mode) {
			case "in":
				nodeList = this.traverseInOrder(this.root);
				break;
			case "post":
				nodeList = this.traversePostOrder(this.root);
				break;
            case "pre":
                nodeList = this.traversePreOrder(this.root)
			default:
				color = true;
				nodeList = this.traverseLevelOrder();
				break;
		}
		return nodeList.reduce(
			(rep, node) => (rep += node.toString(color)),
			""
		);
	}

	/**
	 *  Inserts new node with specified key and rebalances tree following Red-Black Tree rules
     *  Follows algorithm on the slides
	 */
	public insert(key: number): void {
		const newNode = new TreeNode(key);
        // finds where node should be inserted
		const parent = this.locateParent(newNode);
		newNode.parent = parent;
        // use BST Rules for insertion
		if (parent === null) {
            // root of a RBTree has to be black
			newNode.color = Colors.Black;
			this.root = newNode;
			return;
		} else if (newNode.key < parent.key) {
			parent.left = newNode;
		} else {
			parent.right = newNode;
		}
		this.insertFixup(newNode);
	}

	/**
	 * Gets height of the tree
	 */
	public getHeight(): number {
		return RBTree.getNodeHeight(this.root);
	}

    /**
     * Checks if a tree has a key
     */
    public hasKey(key: number): boolean {
        return RBTree.treeSearch(this.root, key) !== null
    }

    /**
     * Deletes node with specified key (key must be in tree)
     * Fixes red black tree properties after removing element
     */
    public delete(key: number){
        // finds node to delete
        const nodeToDelete = RBTree.treeSearch(this.root, key)
        // can't delete a non-existing node
        if(nodeToDelete === null){
            throw `${key} not in tree`
        }
        this.deleteNode(nodeToDelete)
    }

	// PRIVATE STATIC METHODS

	/**
	 * Traverses a specific level and returns a list with the nodes
	 */
	private static traverseLevel(node: TreeNode, level: number): TreeNode[] {
		if (level === 0) {
            // base case return list with current node
			return [node];
		}
        // goes down the levels until the specified level is reached
		let nodeList: TreeNode[] = [];
		if (node.left) {
			nodeList = [
				...nodeList,
				...RBTree.traverseLevel(node.left, level - 1),
			];
		}
		if (node.right) {
			nodeList = [
				...nodeList,
				...RBTree.traverseLevel(node.right, level - 1),
			];
		}
		return nodeList;
	}

	/**
	 * Returns the height of a given node
	 */
	private static getNodeHeight(node: NodeOrNull): number {
		/**
		 * Finds height of the tree using recursion
		 */
		if (node === null) {
			return 0;
		} else {
			return (
				1 +
				Math.max(
					RBTree.getNodeHeight(node.left),
					RBTree.getNodeHeight(node.right)
				)
			);
		}
	}

	/**
	 * Finds node matching specified key or null if not in tree
	 * Follows algorithm in the BST slides
	 */
	private static treeSearch(node: NodeOrNull, key: number): NodeOrNull {
		if (node === null || node.key === key) {
			return node;
		}
		if (key < node.key) {
			return this.treeSearch(node.left, key);
		} else {
			return this.treeSearch(node.right, key);
		}
	}

    // assertions for error checking
	static assertParent(
		node: TreeNode
	): asserts node is TreeNode & { parent: TreeNode } {
		if (node.parent === null) {
			throw `parent of ${node} is null`;
		}
	}

    static assertNotNull(node: NodeOrNull, identifier: string): asserts node is TreeNode{
        if(node === null){
            throw `node ${identifier}is null`
        }
    }

    // other helpers

    private static isBlack(node: NodeOrNull): boolean {
        return node === null || node.color === Colors.Black
    }

    private static isRed(node: NodeOrNull): boolean {
        return !RBTree.isBlack(node)
    }

	// PRIVATE INSTANCE METHODS

	// traversal methods

	/**
	 * Provides level order traversal used for testing
	 * (order used in the array representation of a heap for example)
	 */
	private traverseLevelOrder(): TreeNode[] {
		if (this.root === null) {
			return [];
		}
		let nodeList: TreeNode[] = [];
		/**
		 * Traverses each level and joins the lists of nodes
		 */
		for (let i = 0; i < this.getHeight(); i++) {
			nodeList = [...nodeList, ...RBTree.traverseLevel(this.root, i)];
		}
		return nodeList;
	}

	/**
	 * Traverses tree in order returning a list that is sorted
	 */
	private traverseInOrder(node: NodeOrNull): TreeNode[] {
		if (node === null) {
			return [];
		}
		return [
			...this.traverseInOrder(node.left),
			node,
			...this.traverseInOrder(node.right),
		];
	}

	/**
	 * Traverses tree in post order returning a list
	 */
	private traversePostOrder(node: NodeOrNull): TreeNode[] {
		if (node === null) {
			return [];
		}
		return [
			...this.traversePostOrder(node.left),
			...this.traversePostOrder(node.right),
			node,
		];
	}

    /**
	 * Traverses tree in post order returning a list
	 */
	private traversePreOrder(node: NodeOrNull): TreeNode[] {
		if (node === null) {
			return [];
		}
		return [
            node,
			...this.traversePostOrder(node.left),
			...this.traversePostOrder(node.right),
		];
	}

	// insertion helpers

	/**
	 * Locates adequate parent for newNode considering rules of a Binary Search Tree
	 */
	private locateParent(newNode: TreeNode): NodeOrNull {
		let parent: NodeOrNull = null;
		let currentNode = this.root;
		// iterate until a leaf
		while (currentNode !== null) {
			parent = currentNode;
			/**
			 * If key is smaller, must go to the left
			 * If key is larger, must go to the right
			 */
			if (newNode.key < currentNode.key) {
				currentNode = currentNode.left;
			} else {
				currentNode = currentNode.right;
			}
		}
		return parent;
	}

	/**
	 * Returns sibling node
	 */
	private getSibling(node: TreeNode): NodeOrNull {
		if (node.parent === null) {
			throw "node has no siblings";
		}
		const parent: TreeNode = node.parent;
		if (parent.left === node) {
			return parent.right;
		} else {
			return parent.left;
		}
	}

	/**
	 * Makes new tree comply with red-black tree rules
	 * following algorithm in the slides
	 */
	private insertFixup(node: TreeNode): void {
		this.insertFixupA(node);
		const nextToBeAdjusted = this.insertFixupB(node);
		if (nextToBeAdjusted !== null) {
			this.insertFixupC(nextToBeAdjusted);
		}
		if (this.root === null) {
			throw "Root can't be null after insertion";
		}
        // root has to be black
        this.root.color = Colors.Black;
	}

	/**
	 * Looks for and if necessary fixes the case when the node's uncle is red
	 */
	private insertFixupA(newNode: TreeNode): void {
		let node = newNode;
		while (node.parent !== null && node.parent.color !== Colors.Black) {
			const uncle = this.getSibling(node.parent);
			// only proceed if uncle is red
			if (uncle === null || uncle.color === Colors.Black) {
				return;
			}
			// fix colors of nodes
			node.parent.color = Colors.Black;
			uncle.color = Colors.Black;
			RBTree.assertParent(node.parent);
			node = node.parent.parent;
			node.color = Colors.Red;
		}
	}

	/**
	 * Looks for and fixes the case where a rotation on parent is necessary
	 */
	private insertFixupB(node: TreeNode): NodeOrNull {
		RBTree.assertParent(node);
		// check if rotation is necessary
		if (this.root === node || node.parent.color === Colors.Black) {
			return this.getSibling(node);
		}
		const parent: TreeNode = node.parent;
		RBTree.assertParent(parent);
		const grandparent = parent.parent;
		if (node == parent.right && parent === grandparent.left) {
			// if node left then right from grandparent, rotate left on parent
			this.rotateLeft(parent);
            return parent;
		} else if (node === parent.left && parent === grandparent.right) {
			// if node right then left from grandparent, rotate right on parent
			this.rotateRight(parent);
            return parent;
		}
        return node
	}

	/**
	 * Looks for and fixes case where a rotation on the grandparent is necessary
	 */
	private insertFixupC(node: TreeNode): void {
		// check if rotation is necessary
		if (node.parent == null || node.parent.color == Colors.Black) {
			return;
		}
		const parent = node.parent;
		const grandparent = parent.parent;
		if (grandparent !== null) {
			if (node === parent.left && parent === grandparent.left) {
				// if node is left left from grandparent, rotate right on grandparent
				this.rotateRight(grandparent);
			} else if (node === parent.right && parent === grandparent.right) {
				// if node is right right from grandparent, rotate left on grandparent
				this.rotateLeft(grandparent);
			}
			parent.color = Colors.Black;
			grandparent.color = Colors.Red;
		}
	}

	/**
	 * Normal rotation left on binary search tree
	 */
	private rotateLeft(node: TreeNode): void {
		RBTree.assertNotNull(node.right, `Right of ${node}`)
		const originalRight = node.right;
		node.right = originalRight.left;
		if (originalRight.left !== null) {
			originalRight.left.parent = node;
		}
		originalRight.parent = node.parent;
		if (node.parent === null) {
			// if rotation was on root, root has changed
			this.root = originalRight;
		} else if (node.parent.left === node) {
			node.parent.left = originalRight;
		} else {
			node.parent.right = originalRight;
		}
		originalRight.left = node;
		node.parent = originalRight;
	}

	/**
	 * Normal rotation right on binary search tree
	 */
	private rotateRight(node: TreeNode): void {
		RBTree.assertNotNull(node.left, `Left of ${node}`)
		const originalLeft = node.left;
		node.left = originalLeft.right;
		if (originalLeft.right !== null) {
			originalLeft.right.parent = node;
		}

		originalLeft.parent = node.parent;
		if (node.parent === null) {
			// if rotation was on root, root has changed
			this.root = originalLeft;
		} else if (node.parent.left === node) {
			node.parent.left = originalLeft;
		} else {
			node.parent.right = originalLeft;
		}

		originalLeft.right = node;
		node.parent = originalLeft;
	}

	// DELETION HELPERS

	/**
	 * Transplants a subtree following algorithm on the BST slides
	 * Replace subtree rooted at oldSubtree with subtree rooted at newSubtree
	 */
	private transplant(oldNode: TreeNode, newNode: NodeOrNull) {
		const parent = oldNode.parent;
		if (parent === null) {
			this.root = newNode;
		} else if (oldNode === parent.left) {
			parent.left = newNode;
		} else {
			parent.right = newNode;
		}
		if (newNode !== null) {
			newNode.parent = parent;
		}
	}
    
    /**
     * Finds minimum node in tree rooted in node
     * Uses algorithm from  BST slides
     */
    private static treeMin(node: TreeNode){
        while(node.left !== null){
            node = node.left
        }
        return node
    }

    /**
     * Deletes node from tree following BST rules and rebalances the tree
     * Follows algorithm in the book
     */
    private deleteNode(node: TreeNode): void{
        let originalColor = node.color
        let transplantedNode: NodeOrNull;
        if(node.left === null){
            transplantedNode = node.right
            this.transplant(node, transplantedNode)
        } else if(node.right === null) {
            transplantedNode = node.left
            this.transplant(node, node.left)
        } else {
            const min = RBTree.treeMin(node.right)
            originalColor = min.color
            transplantedNode = min.right
            if(min.parent === node && transplantedNode !== null){
                transplantedNode.parent = min
            } else {
                this.transplant(min, min.right)
                min.right = node.right
                min.right.parent = min
            }
            this.transplant(node, min)
            min.left = node.left
            min.left.parent = min
            min.color = node.color
        }
        if(originalColor === Colors.Black && transplantedNode !== null){
            this.deleteFixup(transplantedNode)
        }
    }

    /**
     * Rebalances red-black tree after regular bst deletion
     */
    private deleteFixup(node: TreeNode){
        let currNode: TreeNode = node
        // root shouldn't be null when fixing a deletion
        RBTree.assertNotNull(this.root, "root")
        while(currNode !== this.root && RBTree.isBlack(currNode)){
            // parent should not be null at this point
            RBTree.assertParent(currNode)
            if(currNode == currNode.parent.left){
                // then uncle is the right of parent
                let sibling = currNode.parent.right
                RBTree.assertNotNull(sibling, "sibling")
                if(RBTree.isRed(sibling)){
                    // node's sibling is red
                    sibling.color = Colors.Black
                    currNode.parent.color = Colors.Red
                    this.rotateLeft(currNode.parent)
                    sibling = currNode.parent.right
                }
                RBTree.assertNotNull(sibling, "sibling")
                if(RBTree.isBlack(sibling.left) && RBTree.isBlack(sibling.right)){
                    // node's sibling is black (null nodes are black), and both of sibling's children are black
                    sibling.color = Colors.Red
                    currNode = currNode.parent
                } else {
                    if (RBTree.isBlack(sibling.right)){
                        // node's sibling is black, sibling's left child is red and sibling's right child is black
                        // at this point, sibling.left should be red, so shouldn't be null
                        RBTree.assertNotNull(sibling.left, "sibling's left child")
                        sibling.left.color = Colors.Black
                        sibling.color = Colors.Red
                        this.rotateRight(sibling)
                        sibling = currNode.parent.right
                    }
                    // sibling is black, and sibling's right child is red
                    // sibling shouldn't be null at this point
                    RBTree.assertNotNull(sibling, "sibling")
                    sibling.color = currNode.parent.color
                    currNode.parent.color = Colors.Black
                    RBTree.assertNotNull(sibling.right, "sibling's right child")
                    sibling.right.color = Colors.Black
                    this.rotateLeft(currNode.parent)
                    currNode = this.root
                }
            } else {
                let sibling = currNode.parent.left
                RBTree.assertNotNull(sibling, "sibling")
                if(RBTree.isRed(sibling)){
                    // node's sibling is red
                    sibling.color = Colors.Black
                    currNode.parent.color = Colors.Red
                    this.rotateRight(currNode.parent)
                    sibling = currNode.parent.left
                }
                RBTree.assertNotNull(sibling, "sibling")
                if(RBTree.isBlack(sibling.right) && RBTree.isBlack(sibling.left)){
                    // node's sibling is black (null nodes are black), and both of sibling's children are black
                    sibling.color = Colors.Red
                    currNode = currNode.parent
                } else {
                    if (RBTree.isBlack(sibling.left)){
                        // node's sibling is black, sibling's right child is red and sibling's left child is black
                        // at this point, sibling.right should be red, so shouldn't be null
                        RBTree.assertNotNull(sibling.right, "sibling's right child")
                        sibling.right.color = Colors.Black
                        sibling.color = Colors.Red
                        this.rotateLeft(sibling)
                        sibling = currNode.parent.left
                    }
                    // sibling is black, and sibling's left child is red
                    // sibling shouldn't be null at this point
                    RBTree.assertNotNull(sibling, "sibling")
                    sibling.color = currNode.parent.color
                    currNode.parent.color = Colors.Black
                    RBTree.assertNotNull(sibling.left, "sibling's left child")
                    sibling.left.color = Colors.Black
                    this.rotateRight(currNode.parent)
                    currNode = this.root
                }
            }
        }
        currNode.color = Colors.Black
    }
}

export default RBTree;
