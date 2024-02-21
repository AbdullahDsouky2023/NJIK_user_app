import React, { useState, useEffect, useRef } from 'react';
import {
  TouchableOpacity,
  Animated,
  PanResponder,
  View,
  Easing,
  Dimensions,
  Text,
} from 'react-native';
import { Audio } from 'expo-av';
import { Entypo, MaterialIcons } from '@expo/vector-icons';

const TRACK_SIZE =   4;
const THUMB_SIZE =   20;

const AudioSlider = ({ audio }) => {
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [trackLayout, setTrackLayout] = useState({});
  const dotOffset = useRef(new Animated.ValueXY()).current;
  const xDotOffsetAtAnimationStart = useRef(0).current;

  const soundObject = useRef(new Audio.Sound()).current;

  useEffect(() => {
    const loadAudio = async () => {
      await soundObject.loadAsync({ uri: audio });
      const status = await soundObject.getStatusAsync();
      setDuration(status.durationMillis);
    };

    loadAudio();

    return () => {
      soundObject.unloadAsync();
    };
  }, [audio]);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetResponderCapture: () => true,
      onMoveShouldSetPanResponderCapture: () => true,
      onPanResponderGrant: async (e, gestureState) => {
        if (playing) {
          await pause();
        }
        xDotOffsetAtAnimationStart.current = dotOffset.x._value;
        await dotOffset.setOffset({ x: dotOffset.x._value });
        await dotOffset.setValue({ x:   0, y:   0 });
      },
      onPanResponderMove: (e, gestureState) => {
        Animated.event([null, { dx: dotOffset.x, dy: dotOffset.y }])(e, gestureState);
      },
      onPanResponderTerminationRequest: () => false,
      onPanResponderTerminate: async (evt, gestureState) => {
        const currentOffsetX = xDotOffsetAtAnimationStart.current + dotOffset.x._value;
        if (currentOffsetX <   0 || currentOffsetX > trackLayout.width) {
          await dotOffset.setValue({ x: -xDotOffsetAtAnimationStart.current, y:   0 });
        }
        await dotOffset.flattenOffset();
        await mapAudioToCurrentTime();
      },
      onPanResponderRelease: async (e, { vx }) => {
        const currentOffsetX = xDotOffsetAtAnimationStart.current + dotOffset.x._value;
        if (currentOffsetX <   0 || currentOffsetX > trackLayout.width) {
          await dotOffset.setValue({ x: -xDotOffsetAtAnimationStart.current, y:   0 });
        }
        await dotOffset.flattenOffset();
        await mapAudioToCurrentTime();
      },
    })
  ).current;

  const mapAudioToCurrentTime = async () => {
    await soundObject.setPositionAsync(currentTime);
  };

  const onPressPlayPause = async () => {
    if (playing) {
      await pause();
      return;
    }
    await play();
  };

  const play = async () => {
    await soundObject.playAsync();
    setPlaying(true);
    startMovingDot();
  };

  const pause = async () => {
    await soundObject.pauseAsync();
    setPlaying(false);
    Animated.timing(dotOffset).stop();
  };

  const startMovingDot = async () => {
    const status = await soundObject.getStatusAsync();
    const durationLeft = status.durationMillis - status.positionMillis;

    Animated.timing(dotOffset, {
      toValue: { x: trackLayout.width, y:   0 },
      duration: durationLeft,
      easing: Easing.linear,
    }).start(() => animationPausedOrStopped());
  };

  const animationPausedOrStopped = async () => {
    if (!playing) {
      return;
    }
    await sleep(200);
    setPlaying(false);
    await soundObject.pauseAsync();
    await dotOffset.setValue({ x:   0, y:   0 });
    await soundObject.setPositionAsync(0);
  };

  const measureTrack = (event) => {
    setTrackLayout(event.nativeEvent.layout);
  };

  const sleep = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  const formatTime = (milliseconds) => {
    const totalSeconds = Math.floor(milliseconds /   1000);
    const minutes = Math.floor(totalSeconds /   60);
    const seconds = totalSeconds - minutes *   60;
    return `${minutes}:${seconds <   10 ? '0' : ''}${seconds}`;
  };

  return (
    <View
      style={{
        flex:   0,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'stretch',
        paddingLeft:   8,
        paddingRight:   8,
      }}
    >
      <View
        style={{
          flex:   0,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingLeft:   8,
          paddingRight:   8,
          height:   35,
        }}
      >
        <TouchableOpacity
          style={{
            flex:   1,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            paddingRight: THUMB_SIZE,
            zIndex:   2,
          }}
          onPress={onPressPlayPause}
        >
          {playing ? (
            <MaterialIcons name="pause" size={30} color="black" />
          ) : (
            <Entypo name="controller-play" size={30} color="black" />
          )}
        </TouchableOpacity>

        <Animated.View
          onLayout={measureTrack}
          style={{
            flex:   8,
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',
            height: TRACK_SIZE,
            borderRadius: TRACK_SIZE /   2,
            backgroundColor: 'black',
          }}
        >
          <Animated.View
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              position: 'absolute',
              left: -(THUMB_SIZE *   4 /   2),
              width: THUMB_SIZE *   4,
              height: THUMB_SIZE *   4,
              transform: [
                {
                  translateX: dotOffset.x.interpolate({
                    inputRange: [0, trackLayout.width ||   0],
                    outputRange: [0, trackLayout.width ||   0],
                    extrapolate: 'clamp',
                  }),
                },
              ],
            }}
            {...panResponder.panHandlers}
          >
            <View
              style={{
                width: THUMB_SIZE,
                height: THUMB_SIZE,
                borderRadius: THUMB_SIZE /   2,
                backgroundColor: 'rgba(0,0,0,0.5)',
              }}
            ></View>
          </Animated.View>
        </Animated.View>
      </View>

      <View style={{
        flex:   0,
        flexDirection: "row",
        justifyContent: "space-between",
      }}>
        <Text style={{ color: 'white' }}>
          {formatTime(currentTime)}
        </Text>
        <Text style={{ color: 'white' }}>
          {formatTime(duration)}
        </Text>
      </View>
    </View>
  );
};

export default AudioSlider;
