import React from 'react';
import {Dimensions, Text, View} from 'react-native';
import {PieChart} from 'react-native-svg-charts';

export const MaisVotados = () => {
  const [selectedSlice, setSelectedSlice] = React.useState({
    label: '',
    value: 0,
  });
  const [labelWidth, setLavelWidth] = React.useState(0);

  const {label, value} = selectedSlice;
  const keys = ['google', 'facebook', 'linkedin', 'youtube', 'Twitter'];
  const values = [15, 25, 35, 45, 55];
  const colors = ['#600080', '#9900cc', '#c61aff', '#d966ff', '#ecb3ff'];
  const data = keys.map((key, index) => {
    return {
      key,
      value: values[index],
      svg: {fill: colors[index]},
      arc: {
        outerRadius: 70 + values[index] + '%',
        padAngle: label === key ? 0.1 : 0,
      },
      onPress: () => setSelectedSlice({label: key, value: values[index]}),
    };
  });
  const deviceWidth = Dimensions.get('window').width;
  return (
    <View style={{justifyContent: 'center', flex: 1}}>
      <PieChart
        style={{height: 200}}
        outerRadius={'80%'}
        innerRadius={'45%'}
        data={data}
      />
      <Text
        onLayout={({
          nativeEvent: {
            layout: {width},
          },
        }) => {
          setLavelWidth(width);
        }}
        style={{
          position: 'absolute',
          left: deviceWidth / 2 - labelWidth / 2,
          textAlign: 'center',
        }}>
        {`${label} \n ${value}`}
      </Text>
    </View>
  );
};
