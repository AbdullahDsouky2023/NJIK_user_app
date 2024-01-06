import {
  View,
  Text,
  TouchableWithoutFeedback,
  Dimensions,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import AppText from "../AppText";
import { MaterialCommunityIcons,Ionicons, MaterialIcons  } from "@expo/vector-icons";

import { StyleSheet } from "react-native";
import { Colors } from "../../constant/styles";
import RBSheet from "react-native-raw-bottom-sheet";
import CouponModal from "./CouponModal";
import AppButton from "../AppButton";
import { TextInput } from "react-native";
import { useTranslation } from "react-i18next";
import LoadingScreen from "../../screens/loading/LoadingScreen";
import useCoupons, { useUserCoupons } from "../../../utils/coupons";
import { useDispatch, useSelector } from "react-redux";
import { AddDiscount, RemoveDiscount } from "../../store/features/CartSlice";
import {
  clearCurrentOrder,
  setCurrentOrderProperties,
} from "../../store/features/ordersSlice";
const { width, height } = Dimensions.get("screen");
export default function OrderCoupon() {
  const [ModalIsVisible, setModalIsVisible] = useState(false);
  const refRBSheet = useRef();
  const [Validing, setValiditing] = useState(false);
  const [text, setText] = React.useState("");
  const { t } = useTranslation();
  const { data: currentCoupons } = useCoupons();
  const { data: userCoupons } = useUserCoupons();
  const [AddedCoupon,setAddedCoupon]=useState(null)
  const cartItems = useSelector((state) => state.cart.totalPrice);
  const [discount,setDiscount]=useState(null)
  const [PriceBefore,setPriceBefore]=useState(null)
  const currentOrderData = useSelector(
    (state) => state?.orders?.currentOrderData
  );

  const handleDeleteCoupon = ()=>{
    setAddedCoupon(null)
    dispatch(RemoveDiscount(PriceBefore))
    dispatch(setCurrentOrderProperties(
        {
            coupons: {
              connect: [],
            },
        }
      ))
  }
  const [Error, SetError] = useState("");
  const dispatch = useDispatch();
  const handleAddCoupon = async () => {
    try {
      setValiditing(true);
      console.log("current",currentOrderData)
      const isValideCoupon = currentCoupons.filter((coupon) => {
        return coupon.attributes?.code === text;
      });
      if (isValideCoupon.length !== 0) {
        const isUsed = userCoupons.coupons.filter((coupon)=>{
            return coupon.code === text
        })
        if (isUsed.length > 0  ) {
          SetError("Coupon is used before!");
        } else   {
          console.log("use or unsded",currentOrderData.coupons === undefined)
          if (!AddedCoupon ) {

            console.log("aplly now ");
            const discountPercentage = Number(isValideCoupon[0]?.attributes?.value)/100
            const currentOrderPrice = Number(cartItems)
            const CurrentPrice  =(currentOrderPrice -  (discountPercentage * currentOrderPrice)).toFixed(2)
            refRBSheet.current.close()
            setAddedCoupon(isValideCoupon)
            console.log("adding the coupon to the user ",isValideCoupon[0].id)
            dispatch(AddDiscount(CurrentPrice.toString()))
            setPriceBefore( currentOrderPrice.toString())
            dispatch(setCurrentOrderProperties(
                {
                    coupons: {
                      connect: [{ id: isValideCoupon[0].id }],
                    },
                }
              ))
            SetError('')
            setText('')
          }else {
                SetError("Using muliple coupons is not allowed!");
            
          }
        }
      } else if (isValideCoupon.length === 0) {
        SetError("Coupon is not valid");
      }
    } catch (error) {
    } finally {
      setValiditing(false);
    }
  };

  useEffect(() => {
    return () => {
      dispatch(clearCurrentOrder());
    };
  }, []);

  const ErrorMessages = ["Coupon is not valid", "Coupon is used Before!"];
  return (
    <ScrollView>
      <TouchableWithoutFeedback onPress={() => refRBSheet.current.open()}>
        <View style={styles.container}>
          <AppText text={"Add Coupon"} centered={false} style={styles.text} />
          <MaterialCommunityIcons
            name="gift-open-outline"
            size={24}
            color="white"
          />
        </View>
      </TouchableWithoutFeedback>
      {
        AddedCoupon &&
      <View style={styles.couponAdded}>
        <AppText text={AddedCoupon[0]?.attributes?.code} style={{color:Colors.whiteColor}}/>
        <TouchableOpacity
                  style={styles.deleteIcon}
                  onPress={() => handleDeleteCoupon()}
                >
                  <MaterialIcons name="delete" size={24} color="red" />
                </TouchableOpacity>
      </View>
      }
      <RBSheet
        ref={refRBSheet}
        closeOnDragDown={true}
        closeOnPressMask={false}
        customStyles={{
          wrapper: {
            backgroundColor: "transparent",
            height: 100,
            width: width,
          },
          draggableIcon: {
            backgroundColor: "#000",
          },
        }}
      >
        {Validing ? (
          <LoadingScreen />
        ) : (
          <View style={styles.inputcontainer}>
            <AppText
              text={"Enter Coupon"}
              style={{ color: Colors.blackColor }}
            />
            <TextInput
              //   label={t("Enter Coupon")}
              value={text}
              style={styles.input}
              cursorColor={Colors.primaryColor}
              onChangeText={(text) => setText(text)}
            />
            <AppText text={Error} style={styles.errorMessage} />
            <AppButton
              title={"Confirm"}
              disabled={!text}
              style={styles.button}
              onPress={handleAddCoupon}
            />
          </View>
        )}
      </RBSheet>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
    gap: 20,
    width: width * 0.9,
    padding: 10,
    marginTop: 20,
    borderRadius: 10,
    backgroundColor: Colors.primaryColor,
    justifyContent: "space-between",
  },
  text: {
    color: Colors.whiteColor,
  },
  button: {
    padding: 0,
    width: width * 0.5,
    alignSelf: "center",
  },
  input: {
    backgroundColor: "white",
    color: "red",
    width:width*0.5,
    margin:'auto',
    marginHorizontal: 30,
    paddingHorizontal: 0,
    borderBottomColor: "red",
    borderBottomWidth: 2,
    paddingTop: 10,
    textAlign:'center'
  },
  couponAdded:{
    padding:6,
    borderRadius:15,
    backgroundColor:Colors.success,
    width:width*0.35,
    marginTop:10
  },
  errorMessage: {
    color: Colors.redColor,
    fontSize: 15,
    marginTop: 10,
  },
  deleteIcon: {
    position: "absolute",
    top: -10,
    right: -7,
  },
  inputcontainer:{
    display:'flex',
    alignItems:'center',

  }
});
