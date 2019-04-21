import React, { Component, Fragment } from 'react';

import { observer } from 'mobx-react';
import {
  observable, action, configure, transaction,
} from 'mobx';

import Lightbox from 'lightbox-react';
import 'lightbox-react/style.css';


configure({ enforceActions: 'always' });


class LightWrapperOpenStatus {
  @observable isOpen=false;

  @observable mediaIndex=0;

  @action open(index) {
    transaction(() => {
      this.isOpen = true;
      this.mediaIndex = index;
    });
  }

  @action close() {
    this.isOpen = false;
  }
}


const lightWrapperOpenStatus = new LightWrapperOpenStatus();
const lightWrapperClose = lightWrapperOpenStatus.close.bind(lightWrapperOpenStatus);
const lightWrapperOpen = lightWrapperOpenStatus.open.bind(lightWrapperOpenStatus);


const LightWrapper = observer(({ medias }) => {
  const { mediaIndex, isOpen } = lightWrapperOpenStatus;
  if (!isOpen) {
    return <Fragment />;
  }

  const media_srcs = medias.map(({ src }) => src);
  const media_count = media_srcs.length;

  return (
    <Lightbox
      reactModalStyle={{
        overlay: {
          zIndex: 2000,
        },
      }}
      enableZoom
      imageCaption={
        (medias[mediaIndex].title ? <div dangerouslySetInnerHTML={{ __html: medias[mediaIndex].title }} /> : false)
      }
      imageTitle={medias[mediaIndex].alt ? <div dangerouslySetInnerHTML={{ __html: medias[mediaIndex].alt }} /> : false}
      mainSrc={media_srcs[mediaIndex]}
      nextSrc={media_srcs[(mediaIndex + 1) % media_count]}
      prevSrc={media_srcs[(mediaIndex + media_count - 1) % media_count]}
      onCloseRequest={lightWrapperClose}
      onMovePrevRequest={() => lightWrapperOpen((mediaIndex + media_count - 1) % media_count)}
      onMoveNextRequest={() => lightWrapperOpen((mediaIndex + 1) % media_count)}
    />
  );
});


export { lightWrapperOpen, lightWrapperClose };
export default LightWrapper;
