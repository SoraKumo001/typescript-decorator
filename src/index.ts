type AnyFunction = (...args: any[]) => any;

type S3ClassDecorator = (value: Function, context: ClassDecoratorContext) => void | (new () => any);

type ClassMethodDecorator = (
  value: Function,
  context: ClassMethodDecoratorContext | ClassGetterDecoratorContext | ClassSetterDecoratorContext
) => void | AnyFunction;

type ClassFieldDecorator = (
  value: undefined,
  context: ClassFieldDecoratorContext
) => (initialValue: unknown) => any | void;

type ClassAccessorDecorator = (
  value: ClassAccessorDecoratorTarget<unknown, unknown>,
  context: ClassAccessorDecoratorContext
) => ClassAccessorDecoratorResult<unknown, any>;

const classDecorator: S3ClassDecorator = (value, context) => {
  context.addInitializer(() => console.log(`初期化:${context.kind}:${String(context.name)}`));
  console.log(value, context);
};

const classFieldDecorator: ClassFieldDecorator = (value, context) => {
  console.log(value, context);
  return (initialValue) => `取得:${context.kind}:${String(context.name)} => ${initialValue}`;
};

const classMethodDecorator: ClassMethodDecorator = (value, context) => {
  console.log(value, context);
  context.addInitializer(() => console.log(`初期化:${context.kind}:${String(context.name)}`));
  return function (this: unknown, ...args: any[]) {
    return `取得:${context.kind}:${String(context.name)} => ${value.apply(this, args)}`;
  };
};

const classAccessorDecorator: ClassAccessorDecorator = (value, context) => {
  console.log(value, context);
  return {
    get(this) {
      return `取得:${context.kind}:${String(context.name)} => ${value.get.apply(this)}`;
    },
  };
};

console.log('START');

@classDecorator
class Test1 {
  @classAccessorDecorator
  accessor a = 1;
  @classFieldDecorator
  b = 10;
  @classMethodDecorator
  get c() {
    return 123;
  }
  @classMethodDecorator
  add(a: number, b: number) {
    return a + b;
  }
}

console.log('test1');
const test = new Test1();
console.log(test.a);
console.log(test.b);
console.log(test.c);
console.log(test.add(10, 20));

console.log('test2');
const test2 = new Test1();
console.log(test2.a);
console.log(test2.b);
console.log(test2.c);
console.log(test2.add(10, 20));

console.log('END');
