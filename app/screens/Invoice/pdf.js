// Pdf.js
import React, { useEffect } from 'react';
import { View, Button, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import * as Print from 'expo-print';
import { shareAsync } from 'expo-sharing';
import Invoice from './Invoice'; // Import your Invoice component
import { FontAwesome5 } from '@expo/vector-icons';
import QRCode from 'react-native-qrcode-svg';

// ... inside your component

import { Colors } from '../../constant/styles';
const { height } = Dimensions.get('screen')
export default function Pdf({ item }) {
  const qrCodeValue = item?.id; // Replace with your item ID
  const qrCodeSize = 100; // Adjust the size as needed
  const cartServiveItems = item?.attributes?.service_carts?.data?.length > 0 && item?.attributes?.service_carts?.data?.map((item) => (
    `
    <tr>
                      <td style="font-size: 12px; font-family: 'Open Sans', sans-serif; color: #f2652a;  line-height: 18px;  vertical-align: top; padding:10px 0;" class="article">
                       ${item?.attributes?.service?.data?.attributes?.name}
                      </td>
                      <td style="font-size: 12px; font-family: 'Open Sans', sans-serif; color: #646a6e;  line-height: 18px;  vertical-align: top; padding:10px 0;" align="center"> ${item?.attributes?.qty}</td>
                      <td dir="rtl" style="font-size: 12px; font-family: 'Open Sans', sans-serif; color: #1e2b33;  line-height: 18px;  vertical-align: top; padding:10px 0;" align="right"> 
                      ${item?.attributes?.service?.data?.attributes?.Price}  
                                 </td>
                                 </tr>`
  ))

  const servicesItem = item?.attributes?.services?.data?.length > 0 && item?.attributes?.services?.data?.map((item) => (`
    <tr>
                      <td style="font-size: 12px; font-family: 'Open Sans', sans-serif; color: #f2652a;  line-height: 18px;  vertical-align: top; padding:10px 0;" class="article">
                       ${item?.attributes?.name}
                      </td>
                      <td style="font-size: 12px; font-family: 'Open Sans', sans-serif; color: #646a6e;  line-height: 18px;  vertical-align: top; padding:10px 0;" align="center">1</td>
                      <td dir="rtl" style="font-size: 12px; font-family: 'Open Sans', sans-serif; color: #1e2b33;  line-height: 18px;  vertical-align: top; padding:10px 0;" align="right"> 
                      ${item?.attributes?.Price > 0 ? `${item?.attributes?.Price}  ` : "بعد الزيارة"}  
                                 </td>
                                 </tr>`
                                 ))
   const VisitingPrice = (`
                                 <tr>
                      <td style="font-size: 12px; font-family: 'Open Sans', sans-serif; color: #f2652a;  line-height: 18px;  vertical-align: top; padding:10px 0;" class="article">
                       سعر الكشف والزيارة 
                      </td>
                      <td style="font-size: 12px; font-family: 'Open Sans', sans-serif; color: #646a6e;  line-height: 18px;  vertical-align: top; padding:10px 0;" align="center"></td>
                      <td dir="rtl" style="font-size: 12px; font-family: 'Open Sans', sans-serif; color: #1e2b33;  line-height: 18px;  vertical-align: top; padding:10px 0;" align="right"> 
                      0
                                 </td>
                                 </tr>`
                                 )
   const TaxesFees = (`
                                 <tr>
                      <td style="font-size: 12px; font-family: 'Open Sans', sans-serif; color: #f2652a;  line-height: 18px;  vertical-align: top; padding:10px 0;" class="article">
                      ضريبة القيمة المضافة
                      </td>
                      <td style="font-size: 12px; font-family: 'Open Sans', sans-serif; color: #646a6e;  line-height: 18px;  vertical-align: top; padding:10px 0;" align="center"></td>
                      <td dir="rtl" style="font-size: 12px; font-family: 'Open Sans', sans-serif; color: #1e2b33;  line-height: 18px;  vertical-align: top; padding:10px 0;" align="right"> 
                   15 %
                                 </td>
                                 </tr>`
                                 )
  const packageItems = item?.attributes?.packages?.data?.length > 0 && item?.attributes?.packages?.data?.map((item) => (
    `
    <tr>
                      <td style="font-size: 12px; font-family: 'Open Sans', sans-serif; color: #f2652a;  line-height: 18px;  vertical-align: top; padding:10px 0;" class="article">
                       ${item.attributes?.name}
                      </td>
                      <td style="font-size: 12px; font-family: 'Open Sans', sans-serif; color: #646a6e;  line-height: 18px;  vertical-align: top; padding:10px 0;" align="center"> 1</td>
                      <td dir="rtl" style="font-size: 12px; font-family: 'Open Sans', sans-serif; color: #1e2b33;  line-height: 18px;  vertical-align: top; padding:10px 0;" align="right"> 
                      ${item?.attributes?.price}   
                                 </td>
                                 </tr>`
  ))
  const additionalPriceItems = item?.attributes?.additional_prices?.data?.length > 0 && item?.attributes?.additional_prices?.data?.map((item) => (
    `
    <tr>
                      <td style="font-size: 12px; font-family: 'Open Sans', sans-serif; color: #f2652a;  line-height: 18px;  vertical-align: top; padding:10px 0;" class="article">
                       ${item.attributes?.details}
                      </td>
                      <td style="font-size: 12px; font-family: 'Open Sans', sans-serif; color: #646a6e;  line-height: 18px;  vertical-align: top; padding:10px 0;" align="center"> </td>
                      <td dir="rtl" style="font-size: 12px; font-family: 'Open Sans', sans-serif; color: #1e2b33;  line-height: 18px;  vertical-align: top; padding:10px 0;" align="right"> 
                      ${item?.attributes?.Price}   
                                 </td>
                                 </tr>`
  ))
  const ProviderFee = item?.attributes?.provider_fee > 0 &&
    `
    <tr>
                      <td style="font-size: 12px; font-family: 'Open Sans', sans-serif; color: #f2652a;  line-height: 18px;  vertical-align: top; padding:10px 0;" class="article">
                       أجرة الفني
                      </td>
                      <td style="font-size: 12px; font-family: 'Open Sans', sans-serif; color: #646a6e;  line-height: 18px;  vertical-align: top; padding:10px 0;" align="center"> </td>
                      <td dir="rtl" style="font-size: 12px; font-family: 'Open Sans', sans-serif; color: #1e2b33;  line-height: 18px;  vertical-align: top; padding:10px 0;" align="right"> 
                      ${item?.attributes?.provider_fee}   
                                 </td>
                                 </tr>`
  console.log("prvider fee", item?.attributes?.provider_fee)

  const printToFile = async () => {
    try {

      const htmlContentWithQRCode = `
      <!-- ... your existing HTML content ... -->
      <img src="https://www.bing.com/ck/a?!&&p=395218a13b7afa0fJmltdHM9MTcwNzM1MDQwMCZpZ3VpZD0xMzAzNGU2MS0xNDFhLTYxMTMtM2Y5Mi01YTc4MTUyOTYwOTUmaW5zaWQ9NTYxMQ&ptn=3&ver=2&hsh=3&fclid=13034e61-141a-6113-3f92-5a7815296095&u=a1L2ltYWdlcy9zZWFyY2g_cT1xciBjb2RlIGltYWdlJkZPUk09SVFGUkJBJmlkPUZBODNERkRBMUNCOTBFRkYzODgyOTFBQkJFNEE4QjE3NTlDRkVFMEU&ntb=1" alt="QR Code" />
    `;
      let servicesHtml = '';
      item?.attributes?.services?.data?.forEach((service, index) => {
        servicesHtml += `<tr><td>${index + 1}</td><td>${service.attributes?.name}</td>
        <td class="right">${service.attributes?.Price > 0 ? service.attributes?.Price : "بعد الزيارة"}</td></tr>`;
      });
      const { uri } = await Print.printToFileAsync({
        html: `
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
                          <td align="left">
                           <img src="https://res.cloudinary.com/dgjgthsst/image/upload/v1707494679/splash2_29ae9d3224.png"
                            width="240" height="100" alt="logo" border="0" /></td>
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
                            <span style='color:#f2652a'> 
                            رقم الطلب :
                            </span>  
                         ${item?.id}
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
                          <td style="font-size: 21px; color: #f2652a; letter-spacing: -1px; font-family: 'Open Sans', sans-serif; line-height: 1; vertical-align: top; text-align: right;">
                            
                           <div style="margin-top:-10px;background-color:#f2652a;color:white;display:flex;padding:20px;align-items:center;justify-content:center;height:55px;width:55px;border-radius: 60px;">
                             
                           فاتورة
                          </div>
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
                            <div style="display: flex;flex-direction: column;gap:15px">     
                            <p   style="margin:10px">
                            <span style='color:#f2652a'> 

                             الرقم الضريبي :
                             </span>
                             454545454.</p>

                            <p style="margin:10px">  <span style='color:#f2652a'>الاسم  :</span> ${item?.attributes?.user?.data?.attributes?.username} </p>
                                 <p>  <span style='color:#f2652a'> رقم الهاتف :</span> ${item?.attributes?.phoneNumber} </p>
                            </td></div> 
                            
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
                    ${cartServiveItems ? cartServiveItems : ""}
                    ${servicesItem ? servicesItem : ""}
                    ${VisitingPrice ? VisitingPrice : ""}

                    ${packageItems ? packageItems : ""}
                    ${additionalPriceItems ? additionalPriceItems : ""}
                    ${ProviderFee ? ProviderFee : ""}
                    ${TaxesFees}
                    <tr>
                      <td height="1" colspan="4" style="border-bottom:1px solid #e4e4e4"></td>
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
                      <td style="font-size: 12px;color:#f2652a; font-family: 'Open Sans', sans-serif; line-height: 22px; vertical-align: top; text-align:right; ">
                        <strong>اجمالي التكلفة</strong>
                      </td>
                      <td style="font-size: 12px; font-family: 'Open Sans', sans-serif; color: #000; line-height: 22px; vertical-align: top; text-align:right; ">
                        <strong> ${item?.attributes?.totalPrice}  <span style="padding-right:15px;color:#f2652a">ريال سعودي</span> </strong>
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

                          <tbody  dir="rtl" style="display: flex;flex-direction: column;gap:10px;justify-content: space-between;" >
                            <tr   >
                              <td style="font-size: 15px; font-family: 'Open Sans', sans-serif;color:#f2652a;; line-height: 1; vertical-align: top; "  style="color:#f2652a;" >
                                <strong>تفاصيل الطلب</strong>
                              </td>
                            </tr>
                            <tr>
                              <td width="100%" height="10"></td>
                            </tr>
                            <tr style="display: flex;flex-direction: row;gap:10px;justify-content: space-between;">
                              <td style="font-size: 14px; font-family: 'Open Sans', sans-serif; color: #5b5b5b; line-height: 20px; vertical-align: top; ">
                             الخدمة المطلوبة
                              </td>
                              <td style="font-size: 12px;min-width:200px; font-family: 'Open Sans', sans-serif; color: #5b5b5b; line-height: 20px; vertical-align: top; ">
                               ${(item?.attributes?.packages?.data[0]?.attributes?.name) ? item?.attributes?.packages?.data[0]?.attributes?.name : ''}
                               ${(item?.attributes?.service_carts?.data[0]?.attributes?.service?.data?.attributes?.category?.data?.attributes?.name) ? item?.attributes?.service_carts?.data[0]?.attributes?.service?.data?.attributes?.category?.data?.attributes?.name : ''}
                               ${(item?.attributes?.services?.data[0]?.attributes?.category
            ?.data?.attributes?.name) ? item?.attributes?.services?.data[0]?.attributes?.category
              ?.data?.attributes?.name : ''}
                              </td>
                            </tr>
                            <tr style="display: flex;flex-direction: row;gap:10px;justify-content: space-between;">
                              <td style="font-size: 14px; font-family: 'Open Sans', sans-serif; color: #5b5b5b; line-height: 20px; vertical-align: top; ">
                                الفني 
                              </td>
                              <td style="font-size: 12px;min-width:200px; font-family: 'Open Sans', sans-serif; color: #5b5b5b; line-height: 20px; vertical-align: top; ">
                                ${item?.attributes?.provider?.data?.attributes?.name} 
                              </td>
                            </tr>
                            <tr style="display: flex;flex-direction: row;gap:10px;justify-content: space-between;">
                              <td style="font-size: 14px; font-family: 'Open Sans', sans-serif; color: #5b5b5b; line-height: 20px; vertical-align: top; ">
                                التاريخ 
                              </td>
                              <td style="font-size: 12px;min-width:200px; font-family: 'Open Sans', sans-serif; color: #5b5b5b; line-height: 20px; vertical-align: top; ">
                                ${item?.attributes?.date} 
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
            <tr  style={display:flex;align-items:center;} dir="rtl">
              <td  dir="rtl">
                <table  dir="rtl" width="480" border="0" cellpadding="0" cellspacing="0" align="center" class="fullPadding">
                  <tbody   dir="rtl">
                    <tr>
                      <td styt>
                        <table  width="320" border="0" cellpadding="0" cellspacing="0" align="right" class="col">
                          <tbody  dir="rtl" >
                            <tr class="hiddenMobile">
                              <td height="35"></td>
                            </tr>
                            <tr class="visibleMobile">
                              <td height="20"></td>
                            </tr>
                            <tr>
                            <td  dir="rtl"  listyle="font-size: 11px; font-family: 'Open Sans', sans-serif; color: #5b5b5b; line-height: 1; vertical-align: top;" style="color:#f2652a;">
                            <strong>الضمان</strong>
                              </td>
                            </tr>
                            <tr dir="rtl">
                              <td  style="font-size: 11px; font-family: 'Open Sans', sans-serif; color: #5b5b5b; line-height: 20px; vertical-align: top; ">
                              <ul style="list-style:decimal;color: #000;display:flex;flex-direction:column;gap:10px">
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
                      <td>
                      <img src="https://th.bing.com/th/id/R.89bac843ee3c2d1a305291abe7b6657c?rik=Ka8RuX9CNkVIyA&pid=ImgRaw&r=0" height=100 width=100 alt="QR Code" />
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
        height: height * 1,
        //  width:width*1
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
  chatContainer: {
    paddingHorizontal: 19,
    backgroundColor: Colors.primaryColor,
    width: "auto",
    height: height * 0.04,
    borderRadius: 20,
    marginTop: -25,
    left: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  }
});
