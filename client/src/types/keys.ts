export type AuthComponent = 'log-in' | 'sign-up'

export type ModalActions = {
  closeModal: () => null
  openModal: (component: AuthComponent) => AuthComponent
}

export const modal = Symbol()
