import { Dispatch } from 'redux';

export interface Redux {
  getState: any;
  dispatch: Dispatch<any>;
}