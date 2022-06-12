import React, {useState} from 'react';
import {Dimensions, Text, View} from 'react-native';
import {PieChart} from 'react-native-svg-charts';
import {colorsOfProject, colors as colorsProj} from '../../configs/layout';

type IChart = {
  keysChart: String[];
  valuesChart: number[];
  colorsChart: String[];
};

export const Chart = ({keysChart, valuesChart, colorsChart}: IChart) => {
  const [keysA, setKeysA] = useState([]);
  const [valuesA, setValuesA] = useState([]);
  const [colorsA, setColorsA] = useState([]);

  const [selectedSlice, setSelectedSlice] = React.useState({
    label: '',
    value: 0,
  });
  const [labelWidth, setLavelWidth] = React.useState(0);

  React.useEffect(() => {
    setKeysA(keysChart);
    setValuesA(valuesChart as number[]);
    setColorsA(colorsChart);
  });

  if (keysA.length <= 1) {
    return null;
  }

  const {label, value} = selectedSlice;
  const keys = keysA;
  const values = valuesA;
  const colors = colorsA;
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
  const deviceWidth = (Dimensions.get('window').width / 130) * 100;
  return (
    <View
      style={{
        justifyContent: 'center',
        flex: 1,
        opacity: 0.8,
        marginBottom: 10,
      }}>
      <PieChart
        style={{height: 250, width: 300}}
        outerRadius={'120%'}
        innerRadius={'50%'}
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
          fontFamily: 'Roboto-Bold',
          fontSize: 20,
          color: colorsProj.white100,
          opacity: 0.7,
        }}>
        {label
          ? `${label} \n ${value} votos`
          : 'Toque na cor para ver quem esta com mais votos'}
        {}
      </Text>
    </View>
  );
};
