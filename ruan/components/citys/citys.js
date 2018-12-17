const flatMap = (arr, callback) => arr.reduce((a, x) => a.concat(callback), []);

Component({
    created:function(opt){
      
    },
    properties: {
        haveHistory: {
            type: Boolean,
            value: true
        },
        scrollWithAnimation: {
            type: Boolean,
            value: true
        },
        lwage:{
          type:Number
        },
        cityShow:{
          type:Boolean,
          value:true
        }
    },
    data: {
        citys: [],
        hotCitys: [],
        locationCity: '',
        scrollWord: 'location',
        currentActive: 'location',
        choosedCitys: void 0,
        searchRes: [],
        historyCitys: void 0,
        remindHide: true,
        remindWord: '...'
    },
    attached() {
        
        new Promise((resolve, reject) => {
            wx.showLoading({
                title: '获取数据...',
                mask: true
            });
            wx.request({
                url: 'https://www.zhipin.com/common/data/city.json',
                method: 'GET',
                dataType: 'json',
                success: resolve,
                fail: reject
            });
        })
            .then(({ data }) => {
                if (data.resmsg === '请求成功') {
                    const result = [];
                    for (const { subLevelModelList } of data.data.cityList) {
                        for (const city of subLevelModelList) {
                            const findRes = result.find(
                                v => v[0] === city.firstChar.toUpperCase()
                            );
                            if (findRes) {
                                findRes[1].push(city);
                            } else {
                                result.push([
                                    city.firstChar.toUpperCase(),
                                    [city]
                                ]);
                            }
                        }
                    }
                    this.citys = result.sort();
                    this.historyCitys =
                        wx.getStorageSync('$city_choose_history') || [];
                    this.setData(
                        {
                            locationCity: data.data.locationCity,
                            hotCitys: data.data.hotCityList.splice(1),
                            citys: this.citys,
                            choosedCitys: data.data.locationCity,
                            historyCitys: this.historyCitys.reverse()
                        },
                        wx.hideLoading
                    );
                } else {
                    wx.showToast({
                        title: '请求错误',
                        icon: 'none',
                        duration: 1500
                    });
                }
            }, console.error)
            .catch(console.error);
    },

    methods: {
        
        setCity({ currentTarget: { dataset } }) {
          this.setData(dataset);
          this.triggerEvent("cityemit",dataset.choosedCitys);
        },

        setWord({ currentTarget: { dataset } }) {
            let remindWord = dataset.scrollWord;
            if (remindWord === 'location') {
                remindWord = '当';
            } else if (remindWord === 'hot') {
                remindWord = '热';
            }
            this.setData({ ...dataset, remindWord, remindHide: false }, () => {
                const remindTime = setTimeout(
                    () =>
                        this.setData({ remindHide: true }, () =>
                            clearTimeout(remindTime)
                        ),
                    500
                );
            });
        },

        search({ detail: { value } }) {
            value = value.trim();
            if (value.length === 0 && this.data.searchRes.length > 0) {
                this.setData({ searchRes: [] });
            } else if (value.length > 0) {
                const searchRes = this.citys
                    .map(city =>
                        city[1].filter(
                            ({ name, firstChar }) =>
                                name.includes(value) ||
                                firstChar === value ||
                                firstChar.toUpperCase() === value
                        )
                    )
                    .reduce((acc, val) => acc.concat(val), []);
                this.setData({ searchRes });
            }
        },

        confirm() {
            const choosedCitys = this.data.choosedCitys;
            const findIndex = this.historyCitys.findIndex(
                ({ code }) => code === choosedCitys.code
            );
            findIndex >= 0 && this.historyCitys.splice(findIndex, 1);
            this.historyCitys.reverse().push(choosedCitys);
            this.historyCitys.length > 4 && this.historyCitys.splice(0, 1);
            wx.setStorage({
                key: '$city_choose_history',
                data: this.historyCitys
            });
            this.triggerEvent('confirm', choosedCitys);
            //this.setData({cityShow:false});
          this.triggerEvent("cityemit", choosedCitys);
        },
        showCity:function(ev){
          //this.setData({cityShow:true});
          this.triggerEvent("cityemit",{bool:false});
        }
    }
});
