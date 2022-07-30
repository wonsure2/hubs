import React, { useContext, useEffect, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import classNames from "classnames";
import configs from "../../utils/configs";
import { CreateRoomButton } from "./CreateRoomButton";
import { PWAButton } from "./PWAButton";
import { useFavoriteRooms } from "./useFavoriteRooms";
import { usePublicRooms } from "./usePublicRooms";
import styles from "./HomePage.scss";
import { AuthContext } from "../auth/AuthContext";
import { createAndRedirectToNewHub } from "../../utils/phoenix-utils";
import { MediaGrid } from "../room/MediaGrid";
import { MediaTile } from "../room/MediaTiles";
import { PageContainer } from "../layout/PageContainer";
import { scaledThumbnailUrlFor } from "../../utils/media-url-utils";
import { Column } from "../layout/Column";
import { Button } from "../input/Button";
import { Container } from "../layout/Container";
import { SocialBar } from "../home/SocialBar";
import { SignInButton } from "./SignInButton";
import { AppLogo } from "../misc/AppLogo";
import { isHmc } from "../../utils/isHmc";
import maskEmail from "../../utils/mask-email";
import {getAppLogo} from "../../utils/get-app-logo";

function getMockRooms() {
  const mockRooms = [
    {
      description: "房间描述1房间描述1房间描述1",
      id: "aPZKXEF",
      images: {
        preview: {
          url: "https://hubs-upload-cdn.com/files/d033c4e4-2174-4c6a-8a42-70b52708044f.jpg"
        }
      },
      lobby_count: 0,
      member_count: 0,
      name: "房间名称1",
      room_size: 24,
      scene_id: "2upDByq",
      type: "room",
      url: "https://dev.reticulum.io/aPZKXEF/elaborate-vibrant-world",
      user_data: null
    },
    {
      description: "房间描述2房间描述2房间描述2",
      id: "aPZKXEG",
      images: {
        preview: {
          url: "https://hubs-upload-cdn.com/files/d033c4e4-2174-4c6a-8a42-70b52708044f.jpg"
        }
      },
      lobby_count: 0,
      member_count: 0,
      name: "房间名称1",
      room_size: 24,
      scene_id: "2upDByp",
      type: "room",
      url: "https://dev.reticulum.io/aPZKXEF/elaborate-vibrant-world",
      user_data: null
    },
    {
      description: "房间描述3房间描述3房间描述3",
      id: "aPZKXEH",
      images: {
        preview: {
          url: "https://hubs-upload-cdn.com/files/d033c4e4-2174-4c6a-8a42-70b52708044f.jpg"
        }
      },
      lobby_count: 0,
      member_count: 0,
      name: "房间名称3",
      room_size: 24,
      scene_id: "2upDByr",
      type: "room",
      url: "https://dev.reticulum.io/aPZKXEF/elaborate-vibrant-world",
      user_data: null
    }, ...new Array(10).fill({
      description: "房间描述3房间描述3房间描述3",
      id: "aPZKXEH",
      images: {
        preview: {
          url: "https://hubs-upload-cdn.com/files/d033c4e4-2174-4c6a-8a42-70b52708044f.jpg"
        }
      },
      lobby_count: 0,
      member_count: 0,
      name: "房间名称3",
      room_size: 24,
      scene_id: "2upDByr",
      type: "room",
      url: "https://dev.reticulum.io/aPZKXEF/elaborate-vibrant-world",
      user_data: null
    })
  ];
  return mockRooms;
}

export function HomePage() {
  const auth = useContext(AuthContext);
  const intl = useIntl();

  const [showMorePublicRooms, setShowMorePublicRooms] = useState(6);
  const [showMoreFavRooms, setShowMoreFavRooms] = useState(6);

  const { results: favoriteRooms } = useFavoriteRooms();
  const { results: publicRooms } = usePublicRooms();

  const sortedFavoriteRooms = Array.from(favoriteRooms).sort((a, b) => b.member_count - a.member_count);
  const sortedPublicRooms = Array.from(publicRooms).sort((a, b) => b.member_count - a.member_count);
  const wrapInBold = chunk => <b>{chunk}</b>;
  useEffect(() => {
    const qs = new URLSearchParams(location.search);

    // Support legacy sign in urls.
    if (qs.has("sign_in")) {
      const redirectUrl = new URL("/signin", window.location);
      redirectUrl.search = location.search;
      window.location = redirectUrl;
    } else if (qs.has("auth_topic")) {
      const redirectUrl = new URL("/verify", window.location);
      redirectUrl.search = location.search;
      window.location = redirectUrl;
    }

    if (qs.has("new")) {
      createAndRedirectToNewHub(null, null, true);
    }
  }, []);

  const canCreateRooms = !configs.feature("disable_room_creation") || auth.isAdmin;
  const email = auth.email;
  return (
    <PageContainer className={styles.homePage}>
      <Container className={styles.topPartAutoMobile}>
        <div className={styles.hero}>
          <div style={{ height: 20 }}>{/*窄屏模式下 width 为0，所以也不影响 UI*/}</div>
          {auth.isSignedIn ? (
            <div className={styles.signInContainer}>
              <span>
                <FormattedMessage
                  id="header.signed-in-as"
                  defaultMessage="Signed in as {email}"
                  values={{ email: maskEmail(email) }}
                />
              </span>
              <a href="#" onClick={auth.signOut} className={styles.mobileSignOut}>
                <FormattedMessage id="header.sign-out" defaultMessage="Sign Out" />
              </a>
            </div>
          ) : (
            <div className={styles.mobileToggleOff}>
              <SignInButton mobile />
            </div>
          )}
          <div className={styles.logoContainer} style={{ flexDirection: "column", alignItems: "center" }}>
            <AppLogo />
            <div
              style={{
                textAlign: "center",
                fontSize: 12,
                color: "#F9F9F9",
                marginTop: 6,
                transform: "scale(0.85)",
                whiteSpace: "nowrap"
              }}
            >
              <FormattedMessage id="header.logo-slogan" defaultMessage="ENT MU Marketing Platform" />
            </div>
          </div>
          {/*<div className={styles.appInfo}>*/}
          {/*  <div className={styles.appDescription}>{configs.translation("app-description")}</div>*/}
          {/*  {canCreateRooms && <CreateRoomButton />}*/}
          {/*  <PWAButton />*/}
          {/*</div>*/}
          <div className={styles.heroImageContainerWrapper}>
            <div
              className={styles.heroImageContainer}
              style={{ backgroundImage: `url(${configs.image("home_background")})`, backgroundSize: "cover" }}
            >
              {/*<img*/}
              {/*  alt={intl.formatMessage(*/}
              {/*    {*/}
              {/*      id: "home-page.hero-image-alt",*/}
              {/*      defaultMessage: "Screenshot of {appName}"*/}
              {/*    },*/}
              {/*    { appName: configs.translation("app-name") }*/}
              {/*  )}*/}
              {/*  src={configs.image("home_background")}*/}
              {/*/>*/}
            </div>
            <div className={styles.heroImageContainerPanel}>
              <div className={styles.heroImageContainerPanelDesc}>
                <p>
                  项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述项目描述
                </p>
              </div>
              <div className={styles.heroImageContainerPanelDescMobile}>
                <img src={getAppLogo()} alt="" className={styles.heroImageContainerPanelDescMobileLogoImg} />
                <div className={styles.heroImageContainerPanelDescMobileContent}>
                  <div className={styles.heroImageContainerPanelDescMobileContent1}>
                    <FormattedMessage
                      id="header.mobile-middle-content-subtitle"
                      defaultMessage="2D Information Display & 3D Immersive Interaction"
                    />
                  </div>
                  <div className={styles.heroImageContainerPanelDescMobileContent2}>
                    <FormattedMessage
                      id="header.mobile-middle-content-text1"
                      defaultMessage="Create one-stop meta-universe"
                    />
                    <br />
                    <FormattedMessage
                      id="header.mobile-middle-content-text2"
                      defaultMessage="marketing platform for enterprises"
                    />
                  </div>
                </div>
              </div>
              <div className={styles.heroImageContainerPanelButtons}>
                {auth.isSignedIn ? (
                  <div className={styles.signInContainerMobile}>
                    <span>
                      <FormattedMessage
                        id="header.signed-in-as-mobile"
                        defaultMessage="Signed in as {email}"
                        values={{ email: maskEmail(email) }}
                      />
                    </span>
                    <a href="#" onClick={auth.signOut} className={styles.mobileSignOut}>
                      <FormattedMessage id="header.sign-out-mobile" defaultMessage="Sign Out" />
                    </a>
                  </div>
                ) : (
                  <div className={styles.mobileToggleOn} style={{ marginBottom: 20 }}>
                    <SignInButton mobile />
                  </div>
                )}
                {canCreateRooms && <CreateRoomButton style={{ width: 208 }} />}
                <div style={{ height: 20 }} />
                <Button lg preset="landing" as="a" href="/link" style={{ width: 208 }}>
                  <span style={{ color: "#F9F9F9" }}>
                    <FormattedMessage id="home-page.have-code" defaultMessage="Have a room code?" />
                  </span>
                </Button>
                <div
                  style={{
                    width: "100%",
                    textAlign: "center",
                    fontSize: 12,
                    transform: "scale(0.8333)",
                    marginTop: 8
                  }}
                >
                  <FormattedMessage
                    id="home-page.have-code-tips"
                    defaultMessage="Supports mobile devices, PCS, and XR devices"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
      {/*{configs.feature("show_feature_panels") && (*/}
      {/*  <Container className={classNames(styles.features, styles.colLg, styles.centerLg)}>*/}
      {/*    <Column padding gap="xl" className={styles.card}>*/}
      {/*      <img src={configs.image("landing_rooms_thumb")} />*/}
      {/*      <h3>*/}
      {/*        <FormattedMessage id="home-page.rooms-title" defaultMessage="Instantly create rooms" />*/}
      {/*      </h3>*/}
      {/*      <p>*/}
      {/*        <FormattedMessage*/}
      {/*          id="home-page.rooms-blurb"*/}
      {/*          defaultMessage="Share virtual spaces with your friends, co-workers, and communities. When you create a room with Hubs, you’ll have a private virtual meeting space that you can instantly share <b>- no downloads or VR headset necessary.</b>"*/}
      {/*          values={{ b: wrapInBold }}*/}
      {/*        />*/}
      {/*      </p>*/}
      {/*    </Column>*/}
      {/*    <Column padding gap="xl" className={styles.card}>*/}
      {/*      <img src={configs.image("landing_communicate_thumb")} />*/}
      {/*      <h3>*/}
      {/*        <FormattedMessage id="home-page.communicate-title" defaultMessage="Communicate and Collaborate" />*/}
      {/*      </h3>*/}
      {/*      <p>*/}
      {/*        <FormattedMessage*/}
      {/*          id="home-page.communicate-blurb"*/}
      {/*          defaultMessage="Choose an avatar to represent you, put on your headphones, and jump right in. Hubs makes it easy to stay connected with voice and text chat to other people in your private room."*/}
      {/*        />*/}
      {/*      </p>*/}
      {/*    </Column>*/}
      {/*    <Column padding gap="xl" className={styles.card}>*/}
      {/*      <img src={configs.image("landing_media_thumb")} />*/}
      {/*      <h3>*/}
      {/*        <FormattedMessage id="home-page.media-title" defaultMessage="An easier way to share media" />*/}
      {/*      </h3>*/}
      {/*      <p>*/}
      {/*        <FormattedMessage*/}
      {/*          id="home-page.media-blurb"*/}
      {/*          defaultMessage="Share content with others in your room by dragging and dropping photos, videos, PDF files, links, and 3D models into your space."*/}
      {/*        />*/}
      {/*      </p>*/}
      {/*    </Column>*/}
      {/*  </Container>*/}
      {/*)}*/}
      <div className={styles.allRoomsContainer}>
        {sortedPublicRooms.length > 0 && (
          <Container className={styles.roomsContainer}>
            <h3 className={styles.roomsHeading}>
              <FormattedMessage id="home-page.public--rooms" defaultMessage="Public Rooms" />
            </h3>
            <Column grow padding className={styles.rooms}>
              <MediaGrid center>
                {sortedPublicRooms.map((room, index) => {
                  if (index >= showMorePublicRooms) {
                    return null;
                  }
                  return (
                    <MediaTile
                      key={room.id}
                      entry={room}
                      description={room.description}
                      processThumbnailUrl={(entry, width, height) =>
                        scaledThumbnailUrlFor(entry.images.preview.url, width, height)
                      }
                      infoStyle={{ background: "rgba(99, 99, 99, 0.2)", color: "rgb(72, 92, 149)" }}
                    />
                  );
                })}
              </MediaGrid>
            </Column>
            {sortedPublicRooms.length > showMorePublicRooms && (
              <div style={{ display: "flex", justifyContent: "center" }}>
                <Button
                  thin
                  style={{ width: "100%", maxWidth: 300 }}
                  onClick={() => {
                    setShowMorePublicRooms(value => value + 6);
                  }}
                >
                  <FormattedMessage id="home-page.more-public-rooms" defaultMessage="Load more" />
                </Button>
              </div>
            )}
          </Container>
        )}
        {sortedFavoriteRooms.length > 0 && (
          <Container className={styles.roomsContainer}>
            <h3 className={styles.roomsHeading}>
              <FormattedMessage id="home-page.favorite-rooms" defaultMessage="Favorite Rooms" />
            </h3>
            <Column grow padding className={styles.rooms}>
              <MediaGrid center>
                {sortedFavoriteRooms.map((room, index) => {
                  if (index >= showMoreFavRooms) {
                    return null;
                  }
                  return (
                    <MediaTile
                      key={room.id}
                      entry={room}
                      description={room.description}
                      processThumbnailUrl={(entry, width, height) =>
                        scaledThumbnailUrlFor(entry.images.preview.url, width, height)
                      }
                      infoStyle={{ background: "rgba(99, 99, 99, 0.2)", color: "rgb(72, 92, 149)" }}
                    />
                  );
                })}
              </MediaGrid>
            </Column>
            {sortedFavoriteRooms.length > showMoreFavRooms && (
              <div style={{ display: "flex", justifyContent: "center" }}>
                <Button
                  thin
                  style={{ width: "100%", maxWidth: 300 }}
                  onClick={() => {
                    setShowMoreFavRooms(value => value + 6);
                  }}
                >
                  <FormattedMessage id="home-page.more-fav-rooms" defaultMessage="Load more" />
                </Button>
              </div>
            )}
          </Container>
        )}
      </div>
      {/*<Container>*/}
      {/*  <Column center grow>*/}
      {/*    <Button thin preset="landing" as="a" href="/link">*/}
      {/*      <FormattedMessage id="home-page.have-code" defaultMessage="Have a room code?" />*/}
      {/*    </Button>*/}
      {/*  </Column>*/}
      {/*</Container>*/}
      {/*{isHmc() ? (*/}
      {/*  <Column center>*/}
      {/*    <SocialBar />*/}
      {/*  </Column>*/}
      {/*) : null}*/}
    </PageContainer>
  );
}
