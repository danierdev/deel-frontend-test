import characters from './characters.json';
import { MockMethod } from 'vite-plugin-mock'

const mocks: MockMethod[] = [
  {
    url: '/api/characters',
    method: 'get',
    response: ({ query }) => {
      return characters.filter(
        (item) => item.name.toLowerCase().includes(query.name.toLowerCase())
      );
    }
  },
]

export default mocks;
