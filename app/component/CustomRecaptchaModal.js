import React, { useRef } from 'react';
import { Modal, Button, View } from 'react-native';
import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';

export default function CustomRecaptchaModal({ visible, onClose,firebaseConfig }) {
 const recaptchaVerifier = useRef(null);

 return (
    <View style={styles.container}>
    <KeyboardAwareScrollView
      style={{ flex: 1, width: '100%' }}
      keyboardShouldPersistTaps="always">
      <TouchableOpacity onPress={() => props.navigation.goBack()}>
        <Image
          style={appStyles.styleSet.backArrowStyle}
          source={appStyles.iconSet.backArrow}
        />
      </TouchableOpacity>
      {isSigningUp ? renderAsSignUpState() : renderAsLoginState()}
      {isSigningUp && (
        <TermsOfUseView tosLink={appConfig.tosLink} style={styles.tos} />
      )}
      <FirebaseRecaptchaVerifierModal
        ref={recaptchaVerifier}
        firebaseConfig={firebaseConfig}
      />
    </KeyboardAwareScrollView>
    {loading && <TNActivityIndicator appStyles={appStyles} />}
  </View>
 );
}
