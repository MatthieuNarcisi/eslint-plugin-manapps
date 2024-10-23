export const onlyOneDescribeAtTopLevelExample = `
    describe('top level', () => {
        it('it', () => {});
        describe('a', () => {});
        describe('b', () => {});
        describe('c', () => {});
    });
`;

export const otherThanDescribeAtTopLevelExample = `
    jest.mock('mock', () => {});
    describe('top level', () => {
        it('it', () => {});
        describe('a', () => {});
        describe('b', () => {});
        describe('c', () => {});
    });
    function a() {}
`;

export const multipleDescribeAtTopLevelExample1 = `
    describe('top level', () => {
        describe('a', () => {});
        describe('b', () => {});
        describe('c', () => {});
    });
    describe('another top level', () => {
        describe('a', () => {});
    });
`;

export const multipleDescribeAtTopLevelExample2 = `
    describe('top level', () => {
        describe('a', () => {});
        describe('b', () => {});
        describe('c', () => {});
    });
    describe('another top level', () => {
        describe('a', () => {});
    });
    describe('again another top level', () => {
        describe('a', () => {});
    });
`;
