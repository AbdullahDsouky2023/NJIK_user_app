// Pdf.js
import React from 'react';
import { View, Button, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import * as Print from 'expo-print';
import { shareAsync } from 'expo-sharing';
import Invoice from './Invoice'; // Import your Invoice component
import { FontAwesome5 } from '@expo/vector-icons';

import { Colors } from '../../constant/styles';
const { height }= Dimensions.get('screen')
export default function Pdf({item}) {
  const printToFile = async () => {
    try {
      let servicesHtml = '';
      item?.attributes?.services?.data?.forEach((service, index) => {
        servicesHtml += `<tr><td>${index+1}</td><td>${service.attributes?.name}</td>
        <td class="right">${service.attributes?.Price>0 ?service.attributes?.Price : "بعد الزيارة"}</td></tr>`;
      });
      const { uri } = await Print.printToFileAsync({
html:`
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title> Order confirmation </title>
<meta name="robots" content="noindex,nofollow" />
<meta name="viewport" content="width=device-width; initial-scale=1.0;" />
<style type="text/css">
  @import url(https://fonts.googleapis.com/css?family=Open+Sans:400,700);
  body { margin: 0; padding: 0; background: #e1e1e1; }
  div, p, a, li, td { -webkit-text-size-adjust: none; }
  .ReadMsgBody { width: 100%; background-color: #ffffff; }
  .ExternalClass { width: 100%; background-color: #ffffff; }
  body { width: 100%; height: 100%; background-color: #e1e1e1; margin: 0; padding: 0; -webkit-font-smoothing: antialiased; }
  html { width: 100%; }
  p { padding: 0 !important; margin-top: 0 !important; margin-right: 0 !important; margin-bottom: 0 !important; margin-left: 0 !important; }
  .visibleMobile { display: none; }
  .hiddenMobile { display: block; }

  @media only screen and (max-width: 600px) {
  body { width: auto !important; }
  table[class=fullTable] { width: 96% !important; clear: both; }
  table[class=fullPadding] { width: 85% !important; clear: both; }
  table[class=col] { width: 45% !important; }
  .erase { display: none; }
  }

  @media only screen and (max-width: 420px) {
  table[class=fullTable] { width: 100% !important; clear: both; }
  table[class=fullPadding] { width: 85% !important; clear: both; }
  table[class=col] { width: 100% !important; clear: both; }
  table[class=col] td { text-align: left !important; }
  .erase { display: none; font-size: 0; max-height: 0; line-height: 0; padding: 0; }
  .visibleMobile { display: block !important; }
  .hiddenMobile { display: none !important; }
  }
</style>


<body>
<!-- Header -->
<table dir="rtl" width="100%" border="0" cellpadding="0" cellspacing="0" align="center" class="fullTable" bgcolor="#e1e1e1">
  <tr  dir="rtl">
    <td height="20"></td>
  </tr>
  <tr >
    <td  dir="rtl">
      <table   dir="rtl" width="600" border="0" cellpadding="0" cellspacing="0" align="center" class="fullTable" bgcolor="#ffffff" style="border-radius: 10px 10px 0 0;">
        <tr class="hiddenMobile">
          <td height="40"></td>
        </tr>
        <tr class="visibleMobile">
          <td height="30"></td>
        </tr>

        <tr  >
          <td  >
            <table     width="480" border="0" cellpadding="0" cellspacing="0" align="center" class="fullPadding">
              <tbody    >
                <tr >
                  <td   >
                    <table   width="220" border="0" cellpadding="0" cellspacing="0" align="left" class="col">
                      <tbody  >
                        <tr>
                          <td align="left"> <img src="https://res.cloudinary.com/dgjgthsst/image/upload/v1707419519/icon_f26d3d1cd3.png" width="64" height="64" alt="logo" border="0" /></td>
                        </tr>
                        <tr class="hiddenMobile">
                          <td height="40"></td>
                        </tr>
                        <tr  class="visibleMobile">
                          <td height="20"></td>
                        </tr>
                        <tr >
                          <td style="font-size: 12px; color: #5b5b5b; font-family: 'Open Sans', sans-serif; line-height: 18px; vertical-align: top; text-align: left;">
                          
                            <br> 
                             رقم الطلب : 454545454.
                            <br> 

                            
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <table  width="220" border="0" cellpadding="0" cellspacing="0" align="right" class="col">
                      <tbody>
                        <tr class="visibleMobile">
                          <td height="20"></td>
                        </tr>
                        <tr>
                          <td height="5"></td>
                        </tr>
                        <tr>
                          <td style="font-size: 21px; color: #ff0000; letter-spacing: -1px; font-family: 'Open Sans', sans-serif; line-height: 1; vertical-align: top; text-align: right;">
                            فاتورة
                          </td>
                        </tr>
                        <tr>
                        <tr class="hiddenMobile">
                          <td height="50"></td>
                        </tr>
                        <tr class="visibleMobile">
                          <td height="20"></td>
                        </tr>
                        <tr>
                          <td style="font-size: 12px; color: #5b5b5b; font-family: 'Open Sans', sans-serif; line-height: 18px; vertical-align: top; text-align: right;">
                            <br>  الرقم الضريبي : 454545454.
                            <br> 
                            الاسم : 454545454.
                            <br> 
                             رقم الهاتف : 454545454.
                            <br> 
                            
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
<!-- /Header -->
<!-- Order Details -->
<table width="100%" border="0" cellpadding="0" cellspacing="0" align="center" class="fullTable" bgcolor="#e1e1e1">
  <tbody>
    <tr>
      <td>
        <table width="600" border="0" cellpadding="0" cellspacing="0" align="center" class="fullTable" bgcolor="#ffffff">
          <tbody>
            <tr>
            <tr class="hiddenMobile">
              <td height="60"></td>
            </tr>
            <tr class="visibleMobile">
              <td height="40"></td>
            </tr>
            <tr>
              <td>
                <table   dir="rtl"   width="480" border="0" cellpadding="0" cellspacing="0" align="center" class="fullPadding">
                  <tbody dir="rtl">
                    <tr >
                      <th dir="rtl" style="font-size: 12px; font-family: 'Open Sans', sans-serif; color: #5b5b5b; font-weight: normal; line-height: 1; vertical-align: top; padding: 0 10px 7px 0;" width="52%" align="right">
                    الخدمة
                      </th>
                     
                      <th style="font-size: 12px; font-family: 'Open Sans', sans-serif; color: #5b5b5b; font-weight: normal; line-height: 1; vertical-align: top; padding: 0 0 7px;" align="center">
                        الكمية
                      </th>
                      <th style="font-size: 12px; font-family: 'Open Sans', sans-serif; color: #1e2b33; font-weight: normal; line-height: 1; vertical-align: top; padding: 0 0 7px;" align="right">
                        السعر
                      </th>
                    </tr>
                    <tr>
                      <td height="1" style="background: #bebebe;" colspan="4"></td>
                    </tr>
                    <tr>
                      <td height="10" colspan="4"></td>
                    </tr>
                    <tr>
                      <td style="font-size: 12px; font-family: 'Open Sans', sans-serif; color: #ff0000;  line-height: 18px;  vertical-align: top; padding:10px 0;" class="article">
                        Beats Studio Over-Ear Headphones
                      </td>
                      <td style="font-size: 12px; font-family: 'Open Sans', sans-serif; color: #646a6e;  line-height: 18px;  vertical-align: top; padding:10px 0;" align="center">1</td>
                      <td style="font-size: 12px; font-family: 'Open Sans', sans-serif; color: #1e2b33;  line-height: 18px;  vertical-align: top; padding:10px 0;" align="right">$299.95</td>
                    </tr>
                    <tr>
                      <td height="1" colspan="4" style="border-bottom:1px solid #e4e4e4"></td>
                    </tr>
                    <tr>
                      <td style="font-size: 12px; font-family: 'Open Sans', sans-serif; color: #ff0000;  line-height: 18px;  vertical-align: top; padding:10px 0;" class="article">Beats RemoteTalk Cable</td>
                      <td style="font-size: 12px; font-family: 'Open Sans', sans-serif; color: #646a6e;  line-height: 18px;  vertical-align: top; padding:10px 0;" align="center">1</td>
                      <td style="font-size: 12px; font-family: 'Open Sans', sans-serif; color: #1e2b33;  line-height: 18px;  vertical-align: top; padding:10px 0;" align="right">$29.95</td>
                    </tr>
                    <tr>
                      <td height="1" colspan="4" style="border-bottom:1px solid #e4e4e4"></td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
            <tr>
              <td height="20"></td>
            </tr>
          </tbody>
        </table>
      </td>
    </tr>
  </tbody>
</table>
<!-- /Order Details -->
<!-- Total -->
<table width="100%" border="0" cellpadding="0" cellspacing="0" align="center" class="fullTable" bgcolor="#e1e1e1">
  <tbody>
    <tr>
      <td>
        <table width="600" border="0" cellpadding="0" cellspacing="0" align="center" class="fullTable" bgcolor="#ffffff">
          <tbody>
            <tr>
              <td>

                <!-- Table Total -->
                <table dir="rtl" width="480" border="0" cellpadding="0" cellspacing="0" align="center" class="fullPadding">
                  <tbody  >
                    
                    <tr>
                      <td style="font-size: 12px; font-family: 'Open Sans', sans-serif; color: #000; line-height: 22px; vertical-align: top; text-align:right; ">
                        <strong>اجمالي التكلفة</strong>
                      </td>
                      <td style="font-size: 12px; font-family: 'Open Sans', sans-serif; color: #000; line-height: 22px; vertical-align: top; text-align:right; ">
                        <strong>$344.90</strong>
                      </td>
                    </tr>
                    
                  </tbody>
                </table>
                <!-- /Table Total -->

              </td>
            </tr>
          </tbody>
        </table>
      </td>
    </tr>
  </tbody>
</table>
<!-- /Total -->
<!-- Information -->
<table width="100%" border="0" cellpadding="0" cellspacing="0" align="center" class="fullTable" bgcolor="#e1e1e1">
  <tbody>
    <tr>
      <td>
        <table width="600" border="0" cellpadding="0" cellspacing="0" align="center" class="fullTable" bgcolor="#ffffff">
          <tbody>
            <tr>
            <tr class="hiddenMobile">
              <td height="60"></td>
            </tr>
            <tr class="visibleMobile">
              <td height="40"></td>
            </tr>
            <tr>
              <td >
                <table  width="480" border="0" cellpadding="0" cellspacing="0" align="center" class="fullPadding">
                  <tbody  >
                    <tr  >
                      <td  >
                        <table  dir="rtl"  width="440" border="0" cellpadding="0" cellspacing="0" align="right" class="col">

                          <tbody  dir="rtl"  >
                            <tr   >
                              <td style="font-size: 15px; font-family: 'Open Sans', sans-serif; color: #5b5b5b; line-height: 1; vertical-align: top; ">
                                <strong>تفاصيل الطلب</strong>
                              </td>
                            </tr>
                            <tr>
                              <td width="100%" height="10"></td>
                            </tr>
                            <tr>
                              <td style="font-size: 14px; font-family: 'Open Sans', sans-serif; color: #5b5b5b; line-height: 20px; vertical-align: top; ">
                             الخدمة المطلوبة
                              </td>
                              <td style="font-size: 12px; font-family: 'Open Sans', sans-serif; color: #5b5b5b; line-height: 20px; vertical-align: top; ">
                                Philip 
                              </td>
                            </tr>
                            <tr>
                              <td style="font-size: 14px; font-family: 'Open Sans', sans-serif; color: #5b5b5b; line-height: 20px; vertical-align: top; ">
                                الفني 
                              </td>
                              <td style="font-size: 12px; font-family: 'Open Sans', sans-serif; color: #5b5b5b; line-height: 20px; vertical-align: top; ">
                                Philip 
                              </td>
                            </tr>
                            <tr>
                              <td style="font-size: 14px; font-family: 'Open Sans', sans-serif; color: #5b5b5b; line-height: 20px; vertical-align: top; ">
                                التاريخ 
                              </td>
                              <td style="font-size: 12px; font-family: 'Open Sans', sans-serif; color: #5b5b5b; line-height: 20px; vertical-align: top; ">
                                Philip 
                              </td>
                            </tr>
                            
                          </tbody>
                        </table>


                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
            <tr  dir="rtl">
              <td  dir="rtl">
                <table  dir="rtl" width="480" border="0" cellpadding="0" cellspacing="0" align="center" class="fullPadding">
                  <tbody   dir="rtl">
                    <tr>
                      <td >
                        <table  width="480" border="0" cellpadding="0" cellspacing="0" align="right" class="col">
                          <tbody  dir="rtl" >
                            <tr class="hiddenMobile">
                              <td height="35"></td>
                            </tr>
                            <tr class="visibleMobile">
                              <td height="20"></td>
                            </tr>
                            <tr>
                              <td  dir="rtl"  listyle="font-size: 11px; font-family: 'Open Sans', sans-serif; color: #5b5b5b; line-height: 1; vertical-align: top; ">
                                <strong>السياسات و الاحكام</strong>
                              </td>
                            </tr>
                            <tr>
                              <td width="100%" height="10"></td>
                            </tr>
                            <tr dir="rtl">
                              <td  style="font-size: 14px; font-family: 'Open Sans', sans-serif; color: #5b5b5b; line-height: 20px; vertical-align: top; ">
                            <ul style="list-style: circle;color: #000;">

                              <li >
                                مدة الضمان 30 يوم من تاريخ 
                                اكتماال الطلب عند الدفع الالكتروني
                              </li>
                              <li>
                                الضمان يشمل شغل اليد فقط          
                              </li>
                            </ul>
                              </td>
                            </tr>
                          </tbody>
                        </table>


                 
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
            <tr class="hiddenMobile">
              <td height="60"></td>
            </tr>
            <tr class="visibleMobile">
              <td height="30"></td>
            </tr>
          </tbody>
        </table>
      </td>
    </tr>
  </tbody>
</table>
<!-- /Information -->
<table width="100%" border="0" cellpadding="0" cellspacing="0" align="center" class="fullTable" bgcolor="#e1e1e1">

  <tr>
    <td>
      <table width="600" border="0" cellpadding="0" cellspacing="0" align="center" class="fullTable" bgcolor="#ffffff" style="border-radius: 0 0 10px 10px;">
        <tr>
          <td>
            <table width="480" border="0" cellpadding="0" cellspacing="0" align="center" class="fullPadding">
              <tbody>
                <tr>
                  <td style="font-size: 12px; color: #5b5b5b; font-family: 'Open Sans', sans-serif; line-height: 18px; vertical-align: top; text-align: left;">
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
        <tr class="spacer">
          <td height="50"></td>
        </tr>

      </table>
    </td>
  </tr>
  <tr>
    <td height="20"></td>
  </tr>
</table>
</body>
</html>`,
     height:height*1
      });

      console.log('File has been saved to:', uri);

      // Share the generated PDF
      await shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
    } catch (error) {
      console.error('Error printing PDF:', error);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
                style={styles.chatContainer}
               onPress={printToFile}
                >
              <FontAwesome5 name="receipt" size={24} color={Colors.whiteColor} />

              </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  chatContainer:{ 
     paddingHorizontal: 19,
    backgroundColor: Colors.primaryColor,
    width: "auto",
    height: height*0.04,
    borderRadius: 20,
    marginTop:-25,
    left: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",}
});
