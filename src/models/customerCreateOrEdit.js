import * as customerService from '../services/customer'
import * as pictureService from '../services/picture'
export default  {

  namespace: 'customerCreateOrEdit',

  state: {
    serverData: {},
    imageFile:[],
  },

  subscriptions: {
    setup({ dispatch, history }) {
      
    },
  },

  effects: {
    *createSingle({payload},{call,put,all}) {
      const [data1,data2] = yield all([call(customerService.createSingle,payload.serverData),call(pictureService.upload,payload.imageFile)])
    }
  },

  reducers: {

    setState (state, action) {
      return { ...state, ...action.payload }
    },

    setServerData (state,{payload}) {
      console.log(payload)
      state.serverData.name = payload.name;
      state.serverData.phone = payload.phone || '';
      state.serverData.wechat = payload.wechat || '';
      state.serverData.seller_id = payload.seller_id;
      state.serverData.vip_id = payload.vip_id;
      // state.serverData.customergroups = [];
      // for(let key in payload) {
      //   if(key.indexOf('goodsGroup'))
      // }
      state.serverData.addresses = payload.addresses.map( item => {
        return {
          name: item.name,
          address: item.addresses,
          province_id: item.location[0],
          city_id: item.location[1],
          phone: item.phone,
          default: item.default,
        }
      })
      state.serverData.attachments = [];
      payload.filelist.forEach( item => {
        delete item.url;
        let current = (window.crypto.getRandomValues(new Uint32Array(1))[0]).toString() + (new Date()).toString()
        state.serverData.attachments.push( current )
        state.imageFile.push({
          image_name: current,
          image_file: item
        })
      })
      return {...state}
    }
  },

};
