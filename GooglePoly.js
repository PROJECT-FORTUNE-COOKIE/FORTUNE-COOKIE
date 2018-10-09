import React, { Component } from 'react';
import { GooglePolyAPIkey } from './secret';

export default class GooglePoly {
  constructor(apiKey) {
    this.apiKey = apiKey;
  }

  static getQueryURL(apiKey) {
    //GET https://poly.googleapis.com/v1/duck?fields=name&key={YOUR_API_KEY}

    var baseURL = 'https://poly.googleapis.com/v1/';
  }
}
