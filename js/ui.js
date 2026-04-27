        // ==================== UI HELPERS ====================
        function getEl(id) { return document.getElementById(id); }
        function customAlert(msg, title = "THÔNG BÁO") {
            return new Promise((resolve) => {
                const modal = getEl('custom-dialog-modal');
                getEl('custom-dialog-title').innerText = title;
                getEl('custom-dialog-title').style.color = 'var(--accent)';
                modal.querySelector('.modal-content').style.borderColor = 'var(--accent)';
                getEl('custom-dialog-msg').innerText = msg;
                getEl('custom-dialog-btns').innerHTML = `<button class="btn-start" style="margin-top:0;" onclick="closeCustomDialog(); window.resolveCustomAlert()">ĐÓNG</button>`;
                window.resolveCustomAlert = resolve;
                modal.style.display = 'flex';
            });
        }

        function customConfirm(msg, title = "XÁC NHẬN") {
            return new Promise((resolve) => {
                const modal = getEl('custom-dialog-modal');
                getEl('custom-dialog-title').innerText = title;
                getEl('custom-dialog-title').style.color = '#ffcc00';
                modal.querySelector('.modal-content').style.borderColor = '#ffcc00';
                getEl('custom-dialog-msg').innerText = msg;
                getEl('custom-dialog-btns').innerHTML = `
                    <button class="btn-start" style="margin-top:0; background:#ff3333;" onclick="closeCustomDialog(); window.resolveCustomConfirm(true)">ĐỒNG Ý</button>
                    <button class="btn-start" style="margin-top:0; background:#333;" onclick="closeCustomDialog(); window.resolveCustomConfirm(false)">HỦY</button>
                `;
                window.resolveCustomConfirm = resolve;
                modal.style.display = 'flex';
            });
        }

        function closeCustomDialog() {
            getEl('custom-dialog-modal').style.display = 'none';
        }
        function showScreen(id) {
            ['selection-screen', 'creation-screen', 'story-screen', 'game-world'].forEach(s => getEl(s).style.display = 'none');
            getEl(id).style.display = 'flex';
        }
        function openModal(id) { getEl(id).style.display = 'flex'; }
        function closeModal(id) { getEl(id).style.display = 'none'; updateGameUI(); }

        // ==================== UI & MISC ====================
        function updateGameUI() {
            const p = gameState.player;
            getEl('game-avatar').src = p.avatar;
            getEl('game-name').innerText = p.name;
            getEl('player-level-badge').innerText = `LV.${p.level}`;
            
            getEl('mini-stats').innerHTML = `
                <div class="mini-stat hp"><span>❤️ HP</span><span>${p.currentHp}/${p.stats.hp}</span></div>
                <div class="mini-stat mp"><span>💙 MP</span><span>${p.currentMp}/${p.stats.mp}</span></div>
                <div class="mini-stat sp"><span>💛 SP</span><span>${p.currentSp}/${p.stats.sp}</span></div>
                <div class="mini-stat exp"><span>✨ EXP</span><span>${p.exp}/${p.expToLevel}</span></div>
                <div class="mini-stat gold"><span>💰 Gold</span><span>${p.gold}</span></div>
                <div class="mini-stat ap"><span>⬆️ AP</span><span>${p.ap}</span></div>
            `;

            getEl('equipment-slots').innerHTML = `
                <div>⚔️ Vũ khí: <span style="color:${p.equipment.weapon ? '#ffaa00' : '#aaa'};">${p.equipment.weapon || 'Tay không'}</span></div>
                <div>🛡️ Giáp: <span style="color:${p.equipment.armor ? '#ffaa00' : '#aaa'};">${p.equipment.armor || 'Áo vải'}</span></div>
            `;

            // Cập nhật thông tin Arc
            const arcInfo = getEl('current-arc-info');
            const arcCont = getEl('arc-progress-container');
            const arcDisp = getEl('arc-wave-display');
            
            if(gameState.selectedArc) {
                const arc = gameState.selectedArc;
                const prog = gameState.player.arcProgress;
                arcInfo.innerHTML = `<strong>${arc.name}</strong><br><small style="color:#ff6666;">Quái: ${arc.creeps[0].hp}-${arc.creeps[arc.creeps.length-1].hp} HP</small>`;
                arcCont.style.display = 'block';
                const pct = (prog.currentWave / prog.totalWaves) * 100;
                arcDisp.innerHTML = `
                    <div style="display:flex; justify-content:space-between; font-size:10px; color:#aaa;">
                        <span>🌊 Wave: ${prog.currentWave}/${prog.totalWaves}</span>
                        <span>👑 Boss: ${prog.bossDefeated ? '✅' : '⏳'}</span>
                    </div>
                    <div class="arc-progress-bar"><div class="arc-progress-fill" style="width: ${pct}%"></div></div>
                `;
            } else {
                arcInfo.innerHTML = '<span style="color:#aaa;">Chưa chọn Arc</span>';
                arcCont.style.display = 'none';
            }

            updateActionBar();
        }

        function updateActionBar() {
            const bar = getEl('action-bar');
            if(gameState.inCombat) {
                const disabled = gameState.actionLocked ? 'disabled' : '';
                bar.innerHTML = `
                    <button class="action-btn" style="background:#2a1a1a; border-color:#ff4444;" onclick="attack()" ${disabled}>⚔️ TẤN CÔNG</button>
                    <button class="action-btn" style="background:#1a1a2a; border-color:#4488ff;" onclick="defend()" ${disabled}>🛡️ PHÒNG THỦ</button>
                    <button class="action-btn" style="background:#002a2a; border-color:#00ffd2;" onclick="openSkillsModal()" ${disabled}>🌀 KỸ NĂNG</button>
                    <button class="action-btn" style="background:#2a0a2a; border-color:#ff44aa;" onclick="openPotionModal()" ${disabled}>🧪 DÙNG THUỐC</button>
                `;
            } else {
                let arcBtn = '';
                if(gameState.selectedArc) {
                    const prog = gameState.player.arcProgress;
                    if(prog.bossDefeated) { arcBtn = `<button class="action-btn" style="background:#2a1a0a; border-color:var(--accent);" onclick="completeArc()">🏆 NHẬN THƯỞNG ARC</button>`; }
                    else { arcBtn = `<button class="action-btn" style="background:#2a1a0a; border-color:var(--accent);" onclick="startNextWave()">⚔️ ĐÁNH WAVE ${prog.currentWave + 1}</button>`; }
                }
                
                bar.innerHTML = `
                    <button class="action-btn" style="background:#2a1a0a; border-color:var(--accent);" onclick="openArcSelection()">📜 CHỌN ARC</button>
                    ${arcBtn}
                    <button class="action-btn" style="background:#0a2a0a; border-color:#44ff44;" onclick="openFarmModal()">🌾 CÀY QUÁI</button>
                    <button class="action-btn" style="background:#2a0a2a; border-color:#ff44aa;" onclick="openShopModal()">🏪 CỬA HÀNG</button>
                    <button class="action-btn" style="background:#0a0a2a; border-color:#4488ff;" onclick="openInventoryModal()">🎒 TÚI ĐỒ</button>
                    <button class="action-btn" onclick="rest()">🏨 NGHỈ NGƠI (100G)</button>
                    <button class="action-btn" style="border-color:#ffaa00;" onclick="saveGame()">💾 LƯU GAME</button>
                    <button class="action-btn" style="border-color:#ff0000; background:#330000;" onclick="returnToMenu()">🚪 THOÁT</button>
                `;
            }
        }

        function rest() {
            if(gameState.player.gold < 100) { addLog("⚠️", "Không đủ Gold để nghỉ ngơi!", 'system'); return; }
            gameState.player.gold -= 100;
            gameState.player.currentHp = gameState.player.stats.hp;
            gameState.player.currentMp = gameState.player.stats.mp;
            gameState.player.currentSp = gameState.player.stats.sp;
            addLog("🏨", "Nghỉ ngơi thành công. Hồi phục 100% HP/MP/SP! (-100 Gold)", 'info');
            updateGameUI();
        }

        function addLog(sender, message, type = 'system') {
            const log = getEl('game-log');
            const entry = document.createElement('div');
            entry.className = `log-entry log-${type}`;
            entry.innerHTML = `<strong>[${sender}]</strong> ${message}`;
            log.appendChild(entry);
            log.scrollTop = log.scrollHeight;
        }

