// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { GroupLocator, ParticipantRole, RoomLocator, TeamsMeetingLinkLocator } from '@azure/communication-calling';

import { v1 as generateGUID } from 'uuid';

/**
 * Get ACS user token from the Contoso server.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const fetchTokenResponse = async (): Promise<any> => {
  const response = await fetch('/token?scope=voip');
  //const response = await fetch('http://localhost:8080/token?scope=voip');
  if (response.ok) {
    const responseAsJson = await response.json(); //(await response.json())?.value?.token;
    const token = responseAsJson.token;
    if (token) {
      return responseAsJson;
    }
  }
  throw new Error('Invalid token response');
};

/**
 * Generate a random user name.
 * @return username in the format user####
 */
export const createRandomDisplayName = (): string => 'user' + Math.ceil(Math.random() * 1000);

/**
 * Get group id from the url's query params.
 */
export const getGroupIdFromUrl = (): GroupLocator | undefined => {
  const urlParams = new URLSearchParams(window.location.search);
  const gid = urlParams.get('groupId');
  return gid ? { groupId: gid } : undefined;
};

export const createGroupId = (): GroupLocator => ({ groupId: generateGUID() });

/**
 * Get teams meeting link from the url's query params.
 */
export const getTeamsLinkFromUrl = (): TeamsMeetingLinkLocator | undefined => {
  const urlParams = new URLSearchParams(window.location.search);
  const teamsLink = urlParams.get('teamsLink');
  return teamsLink ? { meetingLink: teamsLink } : undefined;
};

/**
 * Get room id from the url's query params.
 */
export const getRoomIdFromUrl = (): RoomLocator | undefined => {
  const urlParams = new URLSearchParams(window.location.search);
  const roomId = urlParams.get('roomId');
  return roomId ? { roomId } : undefined;
};

/**
 * Create an ACS room
 */
export const createRoom = async (): Promise<string> => {
  const requestOptions = {
    method: 'POST'
  };
  const response = await fetch(`/createRoom`, requestOptions);
  if (!response.ok) {
    throw 'Unable to create room';
  }

  const body = await response.json();
  return body['id'];
};

/**
 * Add user to an ACS room with a given roomId and role
 */
export const addUserToRoom = async (userId: string, roomId: string, role: ParticipantRole): Promise<void> => {
  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ userId: userId, roomId: roomId, role: role })
  };
  const response = await fetch('/addUserToRoom', requestOptions);
  if (!response.ok) {
    throw 'Unable to add user to room';
  }
};

/*
 * TODO:
 *  Remove this method once the SDK improves error handling for unsupported browser.
 */
export const isOnIphoneAndNotSafari = (): boolean => {
  const userAgent = navigator.userAgent;

  // Chrome uses 'CriOS' in user agent string and Firefox uses 'FxiOS' in user agent string.
  return userAgent.includes('iPhone') && (userAgent.includes('FxiOS') || userAgent.includes('CriOS'));
};

export const isLandscape = (): boolean => window.innerWidth < window.innerHeight;

export const navigateToHomePage = (): void => {
  window.location.href = window.location.href.split('?')[0];
};

export const WEB_APP_TITLE = document.title;