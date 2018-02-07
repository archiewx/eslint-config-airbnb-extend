import * as supplierService from '../services/supplier'
import * as pictureService from '../services/picture'
import pathToRegexp from 'path-to-regexp'
export default  {

  namespace: 'supplierCreateOrEdit',

  state: {
    serverData: {},
    showData: {},
    imageFile: [],
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(() => {
        const match = pathToRegexp('/relationship/supplier-edit/:id').exec(location.hash.slice(1,location.hash.length))
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
      yield call(supplierService.createSingle,payload.serverData)
      for(let i=0;i<payload.imageFile.length;i++) {
        yield call(pictureService.upload,payload.imageFile[i])
      }
    },

    *getSingle({payload},{call,put,all}) {
      const data = yield call(supplierService.getSingle,payload)
      yield put({type:'setShowData',payload:data.result.data})
    },

    *editSingle({payload},{call,put}) {
      yield call(supplierService.editSingle,{serverData:payload.serverData,id:payload.id})
      for(let i=0;i<payload.imageFile.length;i++) {
        yield call(pictureService.upload,payload.imageFile[i])
      }
    }
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
      state.showData.remark1 = payload.remark1;
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
      state.showData.imageFile = [];
      (payload.attachments || []).forEach( (item,index) => {
        state.showData.imageFile.push({
          uid: Number('-' + window.crypto.getRandomValues(new Uint32Array(1))[0].toString()),
          url: payload.attachments_url[index],
          name: item,
          status: 'done'
        })
      })
      return {...state}
    },

    setServerData (state,{payload}) {
      state.serverData.name = payload.name;
      state.serverData.phone = payload.phone;
      state.serverData.wechat = payload.wechat;
      state.serverData.remark1 = payload.remark1;
      state.serverData.addresses = payload.addresses.map( item => {
        return {
          ...{sid:{id: item.sid}}[((item.uid).toString()).indexOf('_') > -1 ? 'sid' : ''],
          name: item.name,
          address: item.address || '',
          province_id: (item.location || [])[0] || '',
          city_id: (item.location || [])[1] || '',
          phone: item.phone || '',
          default: item.default,
        }
      })
      if(state.showData.addresses) {
        state.showData.addresses.forEach( item => {
          if(!state.serverData.addresses.some( n => n.id == item.sid)) {
            state.serverData.addresses.push({
              id: item.sid,
              delete:true
            })
          }
        })
      }
      state.serverData.attachments = [];
      payload.filelist && payload.filelist.forEach( (item,index) => {
        delete item.url;
        if(item.type) {
          let current = (window.crypto.getRandomValues(new Uint32Array(1))[0]).toString() + (new Date()).getTime() + '.' + (item.type).slice(6,(item.type).length)
          state.serverData.attachments.push( current )
          state.imageFile.push({
            image_name: current,
            image_file: item
          })
        }else {
          state.serverData.attachments.push( item.name )      
        }
      })
      console.log(state.serverData)
      return {...state}
    }
  },

};
