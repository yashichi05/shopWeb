<template>
  <div>
    <form 
    name="creat_op"
    style="display:none;"
      ref="my_form"
      id="formCreditCard"
      method="POST"
      accept-charset="UTF-8"
      action="https://payment-stage.opay.tw/Cashier/AioCheckOut/V5"
    >
      MerchantID 商店代號:
      <input type="text" name="MerchantID" v-model="sha256_data.MerchantID" />
      <br />MerchantTradeNo 商店交易編號:
      <input
        type="text"
        name="MerchantTradeNo"
        v-model="sha256_data.MerchantTradeNo"
      />
      <br />MerchantTradeDate 商店交易時間:
      <input
        v-model="sha256_data.MerchantTradeDate"
        type="text"
        name="MerchantTradeDate"
      />
      <br />PaymentType 交易類型:
      <input type="text" name="PaymentType" v-model="sha256_data.PaymentType" />
      <br />TotalAmount 交易金額:
      <input type="text" name="TotalAmount" v-model="sha256_data.TotalAmount" />
      <br />TradeDesc 交易描述:
      <input type="text" name="TradeDesc" v-model="sha256_data.TradeDesc" />
      <br />ItemName 商品名稱:
      <input type="text" name="ItemName" v-model="sha256_data.ItemName" />
      <br />ReturnURL 付款完成通知回傳網址:
      <input v-model="sha256_data.ReturnURL" type="text" name="ReturnURL" />
      <br />ReturnURL 原訂單網址:
      <input v-model="sha256_data.ClientBackURL" type="text" name="ClientBackURL" />
      <br />ChoosePayment 預設付款方式:
      <input
        type="text"
        name="ChoosePayment"
        v-model="sha256_data.ChoosePayment"
      />

      <br />CheckMacValue 簽章類型:
      <input type="text" name="EncryptType" v-model="sha256_data.EncryptType" />
      <br />CheckMacValue 檢查碼:
      <input v-model="CheckMacValue" type="text" name="CheckMacValue" />
      <br />
      <input v-if="false" type="submit" value="送出訂單" />
    </form>

    <form
    
    style="display:none;"
      ref="my_form_get"
      id="formCreditCard_get"
      method="POST"
      accept-charset="UTF-8"
      action="https://payment-stage.opay.tw/Cashier/QueryTradeInfo/V4"
    >
      MerchantID 商店代號:
      <input type="text" name="MerchantID" v-model="sha256_data.MerchantID" />
      <br />MerchantTradeNo 商店交易編號:
      <input
        type="text"
        name="MerchantTradeNo"
        v-model="sha256_data.MerchantTradeNo"
      />
      <br />現在時間:
      <input
        v-model="timestamp"
        type="text"
        name="TimeStamp"
      />
      <br />CheckMacValue 檢查碼:
      <input v-model="get_CheckMacValue" type="text" name="CheckMacValue" />
      <br />
      <input type="submit" value="送出訂單" />
    </form>
  </div>
</template>

<script>
import $ from "jquery";
export default {
  props: ['MerchantTradeNo','MerchantTradeDate','TotalAmount','TradeDesc','ItemName','ClientBackURL','ReturnURL'],
  data() {
    return {
      form_output: "",
      HashKey: "5294y06JbISpM5x9", //店家hash
      HashIV: "v77hoKGq4kWxNNIS",  //店家hah
      sha256_data_ary: [],
      text: "fsdfsdf",
      sha256_data: {
        MerchantID: "2000132", //店家店號
        MerchantTradeNo: this.MerchantTradeNo, //預設值
        MerchantTradeDate: this.MerchantTradeDate, //預設值
        TotalAmount: this.TotalAmount, //預設值
        TradeDesc: this.TradeDesc, //預設值
        ItemName: this.ItemName, //預設值
        ReturnURL: this.ReturnURL, //預設值
        ChoosePayment: "Credit", //繳款方式
        PaymentType: "aio", //勿動
        ClientBackURL:this.ClientBackURL, //預設值
        EncryptType: 1 //勿動
      }
    };
  },
  computed: {
    //訂單狀態 data 
    get_sha256_data(){
      return {
        MerchantID:this.sha256_data.MerchantID,
        MerchantTradeNo:this.sha256_data.MerchantTradeNo,
        TimeStamp:this.timestamp
      }
    },
    //訂單狀態 當前時間戳記
    timestamp(){
      // return '1572104277'
      return Math.floor(Date.now()/1000)
    },
    //建立訂單 檢查碼
    CheckMacValue() {
      let ary = this.sha256toAry(this.sha256_data); //將物件轉成陣列
      this.sort_key(ary, 0); //降陣列整理
      let url = this.toUrl(ary);
      let sha256_str = this.sha256(url.replace(/%20/g, "+"));
      return sha256_str.toUpperCase();
    },
    //訂單狀態 檢查碼
    get_CheckMacValue() {
      let ary = this.sha256toAry(this.get_sha256_data); //將物件轉成陣列
      this.sort_key(ary, 0); //降陣列整理
      let url = this.toUrl(ary);
      // console.log(url);
      let sha256_str = this.sha256(url.replace(/%20/g, "+"));
      return sha256_str.toUpperCase();
    }
  },
  created(){
    let vm = this;
    vm.$bus.$on('credit_pay_submit', (how) => {
      this.sha256_data.ChoosePayment = how;
      setTimeout(function(){$('form[name*="creat_op"]').submit();},1000); //等他變更完成再執行
      
    });
    
  },
  mounted(){
    // this.sha256_data.MerchantTradeNo = this.$route.query.MerchantTradeNo;
    // this.sha256_data.MerchantTradeDate = this.$route.query.MerchantTradeDate;
    // this.sha256_data.TotalAmount = this.$route.query.TotalAmount;
    // this.sha256_data.TradeDesc = this.$route.query.TradeDesc;
    // this.sha256_data.ItemName = this.$route.query.ItemName;
    // this.sha256_data.ClientBackURL = this.$route.query.ClientBackURL;
    // setTimeout(function(){$('form[name*="creat_op"]').submit();},2000);
    

  },
  methods: {
    //編譯sha256
    sha256(ascii) {
      var rightRotate = function(value, amount) {
        return (value >>> amount) | (value << (32 - amount));
      };

      var mathPow = Math.pow;
      var maxWord = mathPow(2, 32);
      var lengthProperty = "length";
      var i, j; // Used as a counter across the whole file
      var result = "";

      var words = [];
      var asciiBitLength = ascii[lengthProperty] * 8;

      //* caching results is optional - remove/add slash from front of this line to toggle
      // Initial hash value: first 32 bits of the fractional parts of the square roots of the first 8 primes
      // (we actually calculate the first 64, but extra values are just ignored)
      var hash = (this.sha256.h = this.sha256.h || []);
      // Round constants: first 32 bits of the fractional parts of the cube roots of the first 64 primes
      var k = (this.sha256.k = this.sha256.k || []);
      var primeCounter = k[lengthProperty];

      var isComposite = {};
      for (var candidate = 2; primeCounter < 64; candidate++) {
        if (!isComposite[candidate]) {
          for (i = 0; i < 313; i += candidate) {
            isComposite[i] = candidate;
          }
          hash[primeCounter] = (mathPow(candidate, 0.5) * maxWord) | 0;
          k[primeCounter++] = (mathPow(candidate, 1 / 3) * maxWord) | 0;
        }
      }

      ascii += "\x80"; // Append Ƈ' bit (plus zero padding)
      while ((ascii[lengthProperty] % 64) - 56) ascii += "\x00"; // More zero padding
      for (i = 0; i < ascii[lengthProperty]; i++) {
        j = ascii.charCodeAt(i);
        if (j >> 8) return; // ASCII check: only accept characters in range 0-255
        words[i >> 2] |= j << (((3 - i) % 4) * 8);
      }
      words[words[lengthProperty]] = (asciiBitLength / maxWord) | 0;
      words[words[lengthProperty]] = asciiBitLength;

      // process each chunk
      for (j = 0; j < words[lengthProperty]; ) {
        var w = words.slice(j, (j += 16)); // The message is expanded into 64 words as part of the iteration
        var oldHash = hash;
        // This is now the undefinedworking hash", often labelled as variables a...g
        // (we have to truncate as well, otherwise extra entries at the end accumulate
        hash = hash.slice(0, 8);

        for (i = 0; i < 64; i++) {
          var i2 = i + j;
          // Expand the message into 64 words
          // Used below if
          var w15 = w[i - 15],
            w2 = w[i - 2];

          // Iterate
          var a = hash[0],
            e = hash[4];
          var temp1 =
            hash[7] +
            (rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25)) + // S1
            ((e & hash[5]) ^ (~e & hash[6])) + // ch
            k[i] +
            // Expand the message schedule if needed
            (w[i] =
              i < 16
                ? w[i]
                : (w[i - 16] +
                  (rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15 >>> 3)) + // s0
                    w[i - 7] +
                    (rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2 >>> 10))) | // s1
                  0);
          // This is only used once, so *could* be moved below, but it only saves 4 bytes and makes things unreadble
          var temp2 =
            (rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22)) + // S0
            ((a & hash[1]) ^ (a & hash[2]) ^ (hash[1] & hash[2])); // maj

          hash = [(temp1 + temp2) | 0].concat(hash); // We don't bother trimming off the extra ones, they're harmless as long as we're truncating when we do the slice()
          hash[4] = (hash[4] + temp1) | 0;
        }

        for (i = 0; i < 8; i++) {
          hash[i] = (hash[i] + oldHash[i]) | 0;
        }
      }

      for (i = 0; i < 8; i++) {
        for (j = 3; j + 1; j--) {
          var b = (hash[i] >> (j * 8)) & 255;
          result += (b < 16 ? 0 : "") + b.toString(16);
        }
      }
      return result;
    },
    //陣列轉文字網址
    toUrl(ary, hash = 1) {
      let url = "";
      for (let item of ary) {
        url += `${item[0]}=${item[1]}&`;
      }
      if (hash) {
        return encodeURIComponent(
          `HashKey=${this.HashKey}&${url}HashIV=${this.HashIV}`
        ).toLowerCase();
      } else {
        return url.substring(0, url.length - 1);
      }
    },
    //物件轉陣列
    sha256toAry(data) {
      let vm = this;
      let ary = [];
      for (let [key, value] of Object.entries(data)) {
        // console.log(`${key}: ${value}`);
        ary.push([key, value]);
      }
      return ary;
    },
    //排列陣列
    sort_key(items, ary_i) {
      //傳入[[key,value],[key,value]],ary_i 為內部第幾個陣列
      items.sort(function(a, b) {
        return a[ary_i].localeCompare(b[ary_i]);
      });
    }
  }
};
</script>


