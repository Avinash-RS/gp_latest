import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { from, BehaviorSubject, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
@Injectable({
  providedIn: 'root'
})
export class APIService {

  BASE_URL = environment.API_BASE_URL;

  constructor(private http: HttpClient, public sanitizer: DomSanitizer) { }

  // Behaviour Subjects
  // For update milestone after editing or deleting
  firstProductMapping = new Subject();
  navigateToSprint = new Subject();
  navigateToParticularSprint = new Subject();
  sprintBoardOnProductChange = new Subject();
  loadReleasesAPI = new Subject();
  sideNavActive = new Subject();
  noMilestone = new Subject();
  memberListRefresh = new Subject();
  forDeleteComment = new Subject();
  profilePicUpdate = new Subject();
  onProductChangeSubject = new Subject();
  powerBI = new Subject();
  userListOnProductChange = new Subject();

  // JSON
  timezoneJson() {
    return this.http.get(`../assets/json/timezone.json`);
  }
  telCodeJson() {
    return this.http.get(`../assets/json/telCode.json`);
  }

  // To access Bearer Token
  accessToken() {
    return localStorage.getItem('Access_Token');
  }

  // Get Product Id
  productId() {
    return JSON.parse(localStorage.getItem('productAccess')).productId.toString();
  }

  // For Login and get user details
  userLogin(loginData) {
    return this.http.post(`${this.BASE_URL}/auth/users/login`, loginData);
  }

  logout() {
    return this.http.post(`${this.BASE_URL}/auth/users/logout`, {});
  }

  // To Resend verfication token for verfying email
  resendVerficationToken() {
    return this.http.get(`${this.BASE_URL}/auth/users/resend-verification`);
  }

  // To Verify Email
  verifyEmail(verficationId) {
    return this.http.get(`${this.BASE_URL}/auth/users/verify/` + verficationId);
  }

  // Forgot Password
  forgotPassword(email) {
    return this.http.post(`${this.BASE_URL}/auth/users/forgot-password`, email);
  }

  // Password Reset
  changePassword(password) {
    return this.http.post(`${this.BASE_URL}/auth/users/change-password`, password);
  }

  // Get products
  productList() {
    return this.http.get(`${this.BASE_URL}/products`);
  }

  // Get teams
  getDepartments() {
    return this.http.get(`${this.BASE_URL}/departments?_all=true`);
  }

  // Get Users
  getUsers() {
    return this.http.get(`${this.BASE_URL}/products/${JSON.parse(localStorage.getItem('productAccess')).productId.toString()}/users?q=&_all=true`);
  }

  // Create Milestone
  createMilestone(newMilestone) {
    return this.http.post(`${this.BASE_URL}/milestones`, newMilestone);
  }

  // Get all Milestone
  getAllMilestone(productId, startDate, endDate) {
    // tslint:disable-next-line: max-line-length
    if (productId !== null) {
      return this.http.get(`${this.BASE_URL}/products/${productId}/milestones?startDate=${startDate}&endDate=${endDate}`);
    }
  }

  // Get all Milestone
  getAllMilestonebyAssignees(productId, startDate, endDate, assignedTo) {
    // tslint:disable-next-line: max-line-length
    if (productId !== null) {
      return this.http.get(`${this.BASE_URL}/products/${productId}/milestones?startDate=${startDate}&endDate=${endDate}&${assignedTo}`);
    }
  }


  // View Milestone
  viewMilestone(milestoneId) {
    return this.http.get(`${this.BASE_URL}/milestones/${milestoneId}`);
  }

  // Edit Milestone
  editMilestone(milestoneId, editData) {
    return this.http.patch(`${this.BASE_URL}/milestones/${milestoneId}`, editData);
  }

    // Edit Milestone
    editMilestoneForView(milestoneId, editData) {
      return this.http.patch(`${this.BASE_URL}/milestones/${milestoneId}`, editData);
    }
  

  // Get Sprints
  getSprints() {
    return this.http.get(`${this.BASE_URL}/products/${JSON.parse(localStorage.getItem('productAccess')).productId.toString()}/jira/bulk-fetch/sprint?key=Tpg`);
  }

  // Get Versions
  getVersions() {
    return this.http.get(`${this.BASE_URL}/products/${JSON.parse(localStorage.getItem('productAccess')).productId.toString()}/jira/bulk-fetch/version?key=Tpg`);
  }


  // Get Versions and Sprints
  getVersionSprints() {
    return this.http.get(`${this.BASE_URL}/products/${JSON.parse(localStorage.getItem('productAccess')).productId.toString()}/version-info`);
  }

  // Delete Milestone
  deleteMilestone(milestoneId) {
    return this.http.delete(`${this.BASE_URL}/milestones/${milestoneId}`);
  }

  // ProgressBar Data
  sprintProgressBar(productId) {
    if (productId !== null) {
      return this.http.get(`${this.BASE_URL}/products/${productId}/releases`);
    }
  }

  // Stories Board API
  storiesBoard(milestoneId) {
    return this.http.get(`${this.BASE_URL}/milestones/${milestoneId}/tasks?_all=true`);
  }

  // Teams Page Dashboard API's

  // Get Users
  getUsersOnTeam() {
    return this.http.get(`${this.BASE_URL}/products/${JSON.parse(localStorage.getItem('productAccess')).productId.toString()}/users?q=&_all=false`);
  }

  // Get Users on gnatt dashboard
  getUsersOnTeamOnGnatt(productId) {
    return this.http.get(`${this.BASE_URL}/products/${productId}/users?q=&_all=false`);
  }


  // Get Roles
  getRolesOnTeam() {
    return this.http.get(`${this.BASE_URL}/roles?_all=true`);
  }

  // Add User
  addMember(memberData) {
    return this.http.post(`${this.BASE_URL}/products/${JSON.parse(localStorage.getItem('productAccess')).productId.toString()}/pm/users`, memberData);
  }

  // Edit User
  editMember(userId, userData) {
    return this.http.patch(`${this.BASE_URL}/products/${JSON.parse(localStorage.getItem('productAccess')).productId.toString()}/pm/users/${userId}`, userData);
  }

  // Get Current Profile Details
  getMyProfile() {
    return this.http.get(`${this.BASE_URL}/users`);
  }

  // Edit my Profile Details
  editMyProfile(userData) {
    return this.http.patch(`${this.BASE_URL}/users`, userData);
  }


  // Comments

  // Add Comment
  addComments(data) {
    return this.http.post(`${this.BASE_URL}/comments`, data);
  }

  // View Comment List
  CommentList(MilestoneId) {
    return this.http.get(`${this.BASE_URL}/milestones/${MilestoneId}/comments`);
  }

  // Edit Comment List
  editComment(commentId, data) {
    return this.http.patch(`${this.BASE_URL}/comments/${commentId}`, data);
  }

  // Delete Comment
  delComment(commentId) {
    return this.http.delete(`${this.BASE_URL}/comments/${commentId}`);
  }

  // Get All milestones name and id for comment
  getAllMilestonesForComment() {
    return this.http.get(`${this.BASE_URL}/products/${JSON.parse(localStorage.getItem('productAccess')).productId.toString()}/milestones?_all=true`);
  }

  // Get All milestones name and id for comment
  getAllMilestonesForEngg() {
    return this.http.get(`${this.BASE_URL}/products/${JSON.parse(localStorage.getItem('productAccess')).productId.toString()}/milestones?startDate=1990-01-01&endDate=2100-01-01`);
  }

  // For Profile Photo

  profilePic(imageData) {
    return fetch('https://upload.imagekit.io/api/v1/files/upload', {
      method: 'POST',
      body: imageData
    });
    // return this.http.post(`https://upload.imagekit.io/api/v1/files/upload`, imageData);
  }

  profilePicSignature() {
    let data;
    return this.http.post(`${this.BASE_URL}/uploader/sign/image-kit`, data);
  }

  // Maps

  mapsApi() {
    return this.http.get(`https://maps.googleapis.com/maps/api/js?key=AIzaSyBWb8W2cEFg6Wk_x2jVNsL9xd2Awkmho44&libraries=places`);
  }

  timeZone(lat, long) {
    return this.http.get(`https://maps.googleapis.com/maps/api/timezone/json?location=${lat},${long}
    &timestamp=1331766000&key=AIzaSyBWb8W2cEFg6Wk_x2jVNsL9xd2Awkmho44`);
  }

  // AIzaSyBTNFv6URFs0_rMwuqFLoS3MwBpicvOXiw
  // AIzaSyCLQyDqu1LfZ5Iz9XoBvRm-9Buf2OTx0yY
}
