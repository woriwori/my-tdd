import Money from '../src/Money';
import Expression from '../src/Expression';
import Bank from '../src/Bank';
import Sum from '../src/Sum';

test('multiplication', () => {
  const fiveInstance: Money = Money.dollar(5);
  expect(fiveInstance.times(2)).toEqual(Money.dollar(10));
  expect(fiveInstance.times(3)).toEqual(Money.dollar(15));
});

test('Franc multiplication', () => {
  const fiveInstance: Money = Money.franc(5);
  expect(fiveInstance.times(2)).toEqual(Money.franc(10));
  expect(fiveInstance.times(3)).toEqual(Money.franc(15));
});

test('equality', () => {
  expect(Money.dollar(5).equals(Money.dollar(5))).toBeTruthy();
  expect(Money.dollar(5).equals(Money.dollar(6))).toBeFalsy();
  expect(Money.dollar(5).equals(Money.franc(5))).toBeFalsy();
});

test('currency', () => {
  expect(Money.dollar(1).currency).toBe('USD');
  expect(Money.franc(1).currency).toBe('CHF');
});

test('simple addition', () => {
  const fiveInstance: Money = Money.dollar(5);
  const sum: Expression = fiveInstance.plus(fiveInstance);
  const bank: Bank = new Bank();
  const reduced: Money = bank.reduce(sum, 'USD');
  expect(reduced).toEqual(Money.dollar(10));
});

test('reduce Sum by Bank', () => {
  const sum: Expression = new Sum(Money.dollar(3), Money.dollar(4));
  const bank: Bank = new Bank();
  const result: Money = bank.reduce(sum, 'USD');

  expect(result).toEqual(Money.dollar(7));
});

test('reduce Money by Bank', () => {
  const bank: Bank = new Bank();
  const result: Money = bank.reduce(Money.dollar(1), 'USD');
  expect(result).toEqual(Money.dollar(1));
});

test('rate for same currency', () => {
  expect(new Bank().rate('USD', 'USD')).toBe(1);
});

test('mix addition', () => {
  const fiveBucks: Expression = Money.dollar(5);
  const tenBucks: Expression = Money.franc(10);
  const bank: Bank = new Bank();
  bank.addRate('CHF', 'USD', 2);
  const result: Money = bank.reduce(fiveBucks.plus(tenBucks), 'USD');

  expect(result).toEqual(Money.dollar(10));
});

test('sum plus money', () => {
  const fiveBucks: Expression = Money.dollar(5);
  const tenBucks: Expression = Money.franc(10);
  const bank: Bank = new Bank();
  bank.addRate('CHF', 'USD', 2);

  // (5dollar, 10franc).plus(5dollar)
  const sum: Expression = new Sum(fiveBucks, tenBucks).plus(fiveBucks);

  // (5dollar + 10franc) + 5dollar
  const result: Money = bank.reduce(sum, 'USD');

  expect(result).toEqual(Money.dollar(15));
});

test('sum times', () => {
  const fiveBucks: Expression = Money.dollar(5);
  const tenBucks: Expression = Money.franc(10);
  const bank: Bank = new Bank();
  bank.addRate('CHF', 'USD', 2);

  // (5dollar, 10franc).times(2)
  const sum: Expression = new Sum(fiveBucks, tenBucks).times(2);

  // (5dollar + 10franc) * 2
  const result: Money = bank.reduce(sum, 'USD');

  expect(result).toEqual(Money.dollar(20));
});
