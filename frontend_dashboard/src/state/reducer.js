//
// PUBLIC_INTERFACE
// reducer.js
// Placeholder reducer for global state if needed in future backend integration.
//

import { ACTIONS } from './actions';

/**
 * PUBLIC_INTERFACE
 * rootReducer
 * Minimal reducer demonstrating future extensibility.
 */
export function rootReducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_PREFERENCE: {
      const { key, value } = action.payload || {};
      if (!key) return state;
      return { ...state, preferences: { ...(state.preferences || {}), [key]: value } };
    }
    default:
      return state;
  }
}
