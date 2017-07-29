import Vue from 'vue'

export const state = () => ({
  currentEndpoints: {},
  endpoints: {}
})

export const mutations = {
  initEndpoint (state, { endpoint, initKey }) {
    Vue.set(state.endpoints, endpoint, {
      updatedInputs: [],
      submitting: false,
      inputs: {}
    })
    if (initKey) {
      Vue.set(state.currentEndpoints, initKey, endpoint)
    }
  },
  initInput (state, { endpoint, inputName, inputValue, afterSave }) {
    Vue.set(state.endpoints[endpoint].inputs, inputName, {
      initValue: inputValue,
      value: inputValue,
      afterSave: afterSave
    })
  },
  setInputValue (state, { endpoint, inputName, inputValue }) {
    if (inputValue === '') {
      inputValue = null
    }
    state.endpoints[endpoint].inputs[inputName].value = inputValue
  },
  setInputInitValue (state, { endpoint, inputName, inputValue }) {
    state.endpoints[endpoint].inputs[inputName].initValue = inputValue
  },
  setUpdatedInputs (state, { endpoint, updatedInputs }) {
    state.endpoints[endpoint].updatedInputs = updatedInputs
  },
  setSubmitting (state, { endpoint, submitting }) {
    state.endpoints[endpoint].submitting = submitting
  }
}

export const getters = {
  isModified: (state) => (endpointKey) => {
    if (!state.endpoints[state.currentEndpoints[endpointKey]]) {
      return false
    }
    return state.endpoints[state.currentEndpoints[endpointKey]].updatedInputs.length > 0
  },
  findEndpointByKey: (state) => (endpointKey) => {
    return state.currentEndpoints[endpointKey]
  },
  getEndpointData: (state) => (endpoint) => {
    return state.endpoints[endpoint]
  },
  getSubmitData: (state) => (endpoint) => {
    let data = {}
    for (let inputKey of state.endpoints[endpoint].updatedInputs) {
      data[inputKey] = state.endpoints[endpoint].inputs[inputKey].value
    }
    return data
  },
  getInput: (state) => (endpoint, inputKey) => {
    return state.endpoints[endpoint].inputs[inputKey]
  },
  getSubmittingByKey: (state) => (endpointKey) => {
    if (!state.endpoints[state.currentEndpoints[endpointKey]]) {
      return false
    }
    return state.endpoints[state.currentEndpoints[endpointKey]].submitting
  }
}

export const actions = {
  setUpdatedInput ({ getters, commit }, { endpoint, inputName }) {
    let endpointData = getters.getEndpointData(endpoint)
    let input = endpointData.inputs[inputName]
    let updatedInputs = endpointData.updatedInputs
    let updatedIndex = updatedInputs.indexOf(inputName)
    if (input.value !== input.initValue) {
      if (updatedIndex === -1) {
        updatedInputs.push(inputName)
      }
    } else {
      if (updatedIndex !== -1) {
        updatedInputs.splice(updatedIndex, 1)
      }
    }
    commit('setUpdatedInputs', { endpoint, updatedInputs })
  },
  setInputValue ({ commit, dispatch }, { endpoint, inputName, inputValue }) {
    commit('setInputValue', { endpoint, inputName, inputValue })
    dispatch('setUpdatedInput', { endpoint, inputName })
  },
  setInputInitValue ({ commit, dispatch, getters }, { endpoint, inputName, inputValue, newUrl }) {
    commit('setInputInitValue', { endpoint, inputName, inputValue })
    dispatch('setUpdatedInput', { endpoint, inputName })
    let inputData = getters.getInput(endpoint, inputName)
    if (inputData.afterSave) {
      inputData.afterSave(newUrl)
    }
  },
  async submit ({ commit, getters, dispatch }, { $axios, endpointKey }) {
    let endpoint = getters.findEndpointByKey(endpointKey)
    commit('setSubmitting', { endpoint, submitting: true })
    let submitData = getters.getSubmitData(endpoint)
    const { data } = await $axios.patch(endpoint, submitData)
    dispatch('setSubmitted', {
      endpoint: endpoint,
      data: data,
      submittedKeys: Object.keys(submitData)
    })
  },
  setSubmitted ({ dispatch, commit }, { endpoint, data, submittedKeys }) {
    for (let inputKey of submittedKeys) {
      dispatch('setInputInitValue', {
        endpoint: endpoint,
        inputName: inputKey,
        inputValue: data.data[inputKey] === undefined ? null : data.data[inputKey],
        newUrl: data.newUrl
      })
    }
    commit('setSubmitting', { endpoint, submitting: false })
  }
}
