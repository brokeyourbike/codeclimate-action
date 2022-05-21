import {getFilename} from './helpers';

beforeEach(() => {
  jest.resetModules()
})

test('getFilename', () => {
  expect(getFilename('linux', '0.0.1')).toBe('test-reporter-0.0.1-linux-amd64')
})
