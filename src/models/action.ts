export interface Action {
  id: string;
  name: string;
  action?: () => void;
}