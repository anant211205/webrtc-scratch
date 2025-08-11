# WebRTC Remote Video Troubleshooting Guide

## Issue: Remote video is not showing between tabs

### Step-by-Step Debugging:

1. **Check Browser Console**
   - Open Developer Tools (F12) in both tabs
   - Look for any error messages or warnings
   - Check the console logs for connection state changes

2. **Test Basic Connection**
   - Navigate to `/test` page first
   - Run "Run All Tests" to verify basic functionality
   - Check if WebRTC support is available
   - Verify socket connection to backend

3. **Check Permissions**
   - Ensure both tabs have camera/microphone permissions
   - Check browser address bar for camera/microphone icons
   - Grant permissions if prompted

4. **Monitor Connection States**
   - Watch the debug info panel in the room
   - Look for these state transitions:
     - ICE Connection: `new` → `checking` → `connected`/`completed`
     - Connection: `new` → `connecting` → `connected`
     - Signaling: `stable` → `have-local-offer` → `stable`

5. **Common Issues and Solutions**

   **Issue: No remote stream received**
   - Check if `track` events are firing in console
   - Verify ICE candidates are being exchanged
   - Check if both peers are in the same room

   **Issue: Remote stream received but video not showing**
   - Try the "Refresh Remote Video" button
   - Check video element event listeners
   - Verify stream tracks are active

   **Issue: Connection never establishes**
   - Check firewall/network restrictions
   - Verify STUN servers are accessible
   - Check if both peers have valid email addresses

6. **Manual Testing Steps**

   a. Open two different browsers (Chrome + Firefox) or incognito tabs
   b. Use different email addresses for each
   c. Join the same room ID
   d. Watch console logs for connection flow
   e. Check debug info panel for state changes

7. **Expected Console Output**

   ```
   === Starting call flow ===
   === SENDING ICE CANDIDATE ===
   === RECEIVED ICE CANDIDATE ===
   === TRACK EVENT RECEIVED ===
   === SETTING REMOTE STREAM TO VIDEO ===
   Remote video loaded metadata
   Remote video can play
   Remote video started playing
   ```

8. **If Still Not Working**

   - Check backend logs for socket connection issues
   - Verify both frontend and backend are running
   - Try different room IDs
   - Check network connectivity between peers
   - Ensure no antivirus/firewall is blocking WebRTC

### Debug Commands

- **Debug Connection**: Shows current peer connection state
- **Send My Stream**: Manually sends local stream
- **Refresh Remote Video**: Restarts remote video element
- **Test Connection Page**: Comprehensive testing at `/test`

### Network Requirements

- STUN servers must be accessible
- No restrictive firewalls
- Both peers must be able to reach each other
- TURN servers may be needed for NAT traversal

### Browser Compatibility

- Chrome/Edge: Full support
- Firefox: Full support  
- Safari: Limited support
- Mobile browsers: Varies by platform 