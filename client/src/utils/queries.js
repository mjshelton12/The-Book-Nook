import { gql } from '@apollo/client';

export const QUERY_GET_ME = gql`
  query getMe {
    me {
      _id
      name
      skills
    }
  }
`;