import RBTree from "./RedBlackTree";

/**
 * Simplifies creating a tree with a serties of numbers as input
 */
function createWithList(list: number[]): RBTree {
    const tree = new RBTree()
    list.forEach(element => tree.insert(element))
    return tree
}

/**
 * Unit tests
 */

// insertion

test("Insert one", () => {
    const tree = new RBTree();
    tree.insert(23)
	expect(tree.toString()).toBe("<23b>");
})

test("Insert two", () => {
    const tree = new RBTree();
    tree.insert(23)
    tree.insert(12)
	expect(tree.toString()).toBe("<23b><12r>");
})

test("Insert red uncle", () => {
    const tree = new RBTree();
    tree.insert(23)
    tree.insert(12)
    tree.insert(40)
    tree.insert(13)
	expect(tree.toString()).toBe("<23b><12b><40b><13r>");
})

test("Insert idk", () => {
    const test = createWithList([0, 20])
    expect(test.toString()).toBe("<0b><20r>")
})

test("Insert idk", () => {
    const test = createWithList([0, 20, 10])
   expect(test.toString()).toBe("<10b><0r><20r>")
})

test("Insert case 2", () => {
    const test = createWithList([0, 20, 10, 5])
    expect(test.toString()).toBe("<10b><0b><20b><5r>")
})

test("Insert many", () => {
    const list = [23, 12, 234, 54, 0, 1, 4, 545]
    const test = createWithList(list)
    const expected = "<23b><1r><234b><0b><12b><54r><545r><4r>"
	expect(test.toString()).toBe(expected);
}) 

// traversal

test("In order traversal 1", () => {
    const list = [123, 345,57 ,875,11, 8, 0, -2134, -1, 9]
    const test = createWithList(list)
    const expected = "-2134,-1,0,8,9,11,57,123,345,875,"
    expect(test.toString("in")).toBe(expected)
})

test("Tree search test found", () => {
    const list = [123, 345,57 ,875,11, 8, 0, -2134, -1, 9]
    const test = createWithList(list)
    const result = test.hasKey(9)
    expect(result).toBe(true)
})

test("Tree search test not found", () => {
    const list = [123, 345,57 ,875,11, 8, 0, -2134, -1, 9]
    const test = createWithList(list)
    const result = test.hasKey(999)
    expect(result).toBe(false)
})

// deletion

test("delete 1", () => {
    const test = createWithList([0, 20, 10, 5, 1, 4])
    test.delete(1)
    expect(test.toString()).toBe("<10b><4r><20b><0b><5b>")
})

test("delete 2", () => {
    const test = createWithList([6, 2, 5, 26, 38, 24, 626])
    //"<5b><2b><26r><6b><38b><24r><626r>"
    expect(test.toString()).toBe("<5b><2b><26r><6b><38b><24r><626r>")
    test.delete(5)
    expect(test.toString()).toBe("<6b><2b><26r><24b><38b><626r>")
})

test("delete 3", () => {
    const test = createWithList([72, 18, 49, 3, 90, 61, 25, 5])
    test.delete(90)
    expect(test.toString()).toBe("<49b><18r><72b><3b><25b><61r><5r>")
})

test("delete 4", () => {
    const test = createWithList([42, 87, 13, 6, 10, 99, 21, 58])
    test.delete(42)
    expect(test.toString()).toBe("<58b><10r><87b><6b><13b><99r><21r>")
})

test("delete size 1", () => {
    const test = new RBTree()
    test.insert(1)
    test.delete(1)
    expect(test.toString()).toBe("")
})

// searching

test("has key true 1", () => {
    const test = createWithList([6, 2, 5, 26, 38, 24, 626])
    expect(test.hasKey(24)).toBe(true)
})

test("has key false 1", () => {
    const test = createWithList([6, 2, 5, 26, 38, 24, 626])
    expect(test.hasKey(1000)).toBe(false)
})

/**
 * Tests with multiple operations
 */

test("multiple 1", () => {
    const test = createWithList([81,79,2,5,3,48,1,999])
    expect(test.toString()).toBe("<79b><3r><81b><2b><5b><999r><1r><48r>")
    test.delete(79)
    expect(test.toString()).toBe("<81b><3r><999b><2b><5b><1r><48r>")
    expect(test.hasKey(81)).toBe(true)
    test.delete(2)
    expect(test.toString()).toBe("<81b><3r><999b><1b><5b><48r>")
    expect(test.hasKey(2)).toBe(false)
    test.insert(55)
    expect(test.toString()).toBe("<81b><3r><999b><1b><48b><5r><55r>")
    expect(test.hasKey(3)).toBe(true)
})