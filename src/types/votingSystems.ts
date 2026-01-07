export type VotingSystemType =
  | 'fibonacci'
  | 'modified-fibonacci'
  | 't-shirt'
  | 'powers-of-2'
  | 'sequential';

export interface VotingSystem {
  id: VotingSystemType;
  name: string;
  values: (number | string)[];
}

export const VOTING_SYSTEMS: Record<VotingSystemType, VotingSystem> = {
  fibonacci: {
    id: 'fibonacci',
    name: 'Fibonacci',
    values: [0, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, '?', '☕'],
  },
  'modified-fibonacci': {
    id: 'modified-fibonacci',
    name: 'Modified Fibonacci',
    values: [0, 0.5, 1, 2, 3, 5, 8, 13, 20, 40, 100, '?', '☕'],
  },
  't-shirt': {
    id: 't-shirt',
    name: 'T-Shirt Sizes',
    values: ['XS', 'S', 'M', 'L', 'XL', 'XXL', '?', '☕'],
  },
  'powers-of-2': {
    id: 'powers-of-2',
    name: 'Powers of 2',
    values: [0, 1, 2, 4, 8, 16, 32, 64, '?', '☕'],
  },
  sequential: {
    id: 'sequential',
    name: 'Sequential',
    values: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, '?', '☕'],
  },
};
