import * as customerService from '../services/customer'
import * as pictureService from '../services/picture'
import pathToRegexp from 'path-to-regexp'
export default  {

  namespace: 'customerCreateOrEdit',

  state: {
    serverData: {},
    showData: {},
    imageFile: [],
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(() => {
        const match = pathToRegexp('/relationship/customer-edit/:id').exec(location.hash.slice(1,location.hash.length))
        if(match) {
          dispatch({type:'getSingle',payload:{id:match[1]}})
        }else {
          dispatch({type:'setState',payload:{showData:{}}})
        }
      })
    },
  },

  effects: {
    *createSingle({payload},{call,put,all}) {
      console.error(payload.imageFile[0])
      // yield all([call(customerService.createSingle,payload.serverData),call(pictureService.upload,payload.imageFile[0])])
      yield call(pictureService.upload,payload.imageFile[0])
      // yield call(customerService.createSingle,payload.serverData)
    },

    *editSingle({payload},{call,put}) {
      yield call(customerService.editSingle,payload)
    },

    *getSingle({payload},{call,put,all}) {
      const data = yield call(customerService.getSingle,payload)
      yield put({type:'setShowData',payload:data.result.data})
    },
  },

  reducers: {

    setState (state, action) {
      return { ...state, ...action.payload }
    },

    setShowData (state,{payload}) {
      state.showData.id = payload.id;
      state.showData.name = payload.name;
      state.showData.phone = payload.phone;
      state.showData.wechat = payload.wechat;
      
      state.showData.seller_id = payload.seller_id;
      state.showData.vip_id = payload.vip_id;
      state.showData.remark1 = payload.remark1;
      state.showData.customerGroup = {};
      payload.customergroups.data.forEach( item => {
        state.showData.customerGroup[`${item.parent_id}`] = (item.id).toString()
      })
      state.showData.addresses = payload.addresses.data.map( (item,index) => {
        return {
          uid: `${item.id}_${index}`,
          sid: item.id,
          name: item.name,
          phone: item.phone,
          location: [item.province_id,item.city_id],
          default: item.default,
          address: item.address
        }
      })
      return {...state}
    },

    setServerData (state,{payload}) {
      console.log(payload)
      console.error(state.showData.addresses)
      state.serverData.name = payload.name;
      state.serverData.phone = payload.phone;
      state.serverData.wechat = payload.wechat;
      state.serverData.seller_id = payload.seller_id;
      state.serverData.vip_id = payload.vip_id;
      state.serverData.customergroups = []
      for(let key in payload) {
        if(key.indexOf('customerGroup_') > -1 && payload[key]) {
          state.serverData.customergroups.push(payload[key])
        }
      }
      state.serverData.addresses = JSON.parse(JSON.stringify(payload.addresses)).map( item => {
        return {
          ...{sid:{id: item.sid}}[((item.uid).toString()).indexOf('_') > -1 ? 'sid' : ''],
          name: item.name,
          address: item.address,
          province_id: item.location[0],
          city_id: item.location[1],
          phone: item.phone,
          default: item.default,
        }
      })
      // state.showData.addresses && state.showData.addresses.forEach( n => {
      //   if(!state.serverData.addresses.some( item => item.id == n.id)) {
      //     state.serverData.addresses.push({
      //       id:n.sid,
      //       delete:true,
      //     })
      //   }
      // })
      state.serverData.attachments = [];
      payload.filelist && payload.filelist.forEach( (item,index) => {
        delete item.url;
        let current = (window.crypto.getRandomValues(new Uint32Array(1))[0]).toString() + (new Date()).getTime() + '.' + (item.type).slice(6,(item.type).length)
        state.serverData.attachments.push( current )
        state.imageFile.push({
          image_name: current,
          image_file: item
        })
      })
      console.log(state.serverData)
      return {...state}
    }
  },

};
