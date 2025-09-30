// Simple test to verify testing infrastructure works
describe('Simple Test Suite', () => {
  it('should pass a basic test', () => {
    expect(true).toBe(true);
  });

  it('should handle basic arithmetic', () => {
    expect(2 + 2).toBe(4);
    expect(5 * 3).toBe(15);
    expect(20 / 4).toBe(5);
  });

  it('should handle string operations', () => {
    expect('hello' + ' ' + 'world').toBe('hello world');
    expect('test'.length).toBe(4);
  });

  it('should handle arrays', () => {
    const arr = [1, 2, 3, 4, 5];
    expect(arr.length).toBe(5);
    expect(arr[0]).toBe(1);
    expect(arr[arr.length - 1]).toBe(5);
  });

  it('should handle objects', () => {
    const obj = { name: 'test', value: 42 };
    expect(obj.name).toBe('test');
    expect(obj.value).toBe(42);
    expect(Object.keys(obj).length).toBe(2);
  });
});
