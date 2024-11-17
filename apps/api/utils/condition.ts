type Condition = 
  | 'equal'
  | 'notEqual'
  | 'greaterThan'
  | 'lessThan'
  | 'greaterThanOrEqual'
  | 'lessThanOrEqual'
  | 'between'
  | 'notBetween'
  | 'in'
  | 'notIn';

export function evaluateCondition(
  value: number,
  condition: Condition,
  args: string // Tham số bổ sung dưới dạng chuỗi
): boolean {
  // Chuyển đổi chuỗi `args` thành mảng số
  const parsedArgs = args.split(',').map(arg => parseFloat(arg.trim()));

  switch (condition) {
    case 'equal':
      return value === parsedArgs[0];
    case 'notEqual':
      return value !== parsedArgs[0];
    case 'greaterThan':
      return value > parsedArgs[0];
    case 'lessThan':
      return value < parsedArgs[0];
    case 'greaterThanOrEqual':
      return value >= parsedArgs[0];
    case 'lessThanOrEqual':
      return value <= parsedArgs[0];
    case 'between':
      return parsedArgs.length === 2 && value > parsedArgs[0] && value < parsedArgs[1];
    case 'notBetween':
      return parsedArgs.length === 2 && (value <= parsedArgs[0] || value >= parsedArgs[1]);
    case 'in':
      return parsedArgs.includes(value);
    case 'notIn':
      return !parsedArgs.includes(value);
    default:
      throw new Error(`Unsupported condition: ${condition}`);
  }
}