# Game RPG - Cập Nhật Toàn Diện

## Tổng Quan
Viết lại hoàn toàn `Game.html` với các tính năng mới, giữ nguyên 2 nhân vật hiện có (Lemmings, Tena Sorimura) và bổ sung hệ thống tạo nhân vật tùy chỉnh.

---

## Các Tính Năng Cần Thêm

### 1. 🎭 Màn Hình Tạo Nhân Vật (Character Creation)
- Thêm nút **"✨ TẠO NHÂN VẬT"** vào màn hình chọn nhân vật
- Màn hình riêng cho phép:
  - Nhập tên nhân vật
  - Upload ảnh đại diện (file input)
  - Phân bổ **70 điểm** vào 12 ability: STR, DEX, INT, HP, MP, SP, ATK, DEF, SPEED, CRIT_R, CRIT_D, WIS
  - Nút `+` / `-` cho từng stat, hiển thị điểm còn lại theo thời gian thực

### 2. ⚡ Hệ Thống Ability Points (AP)
- Mỗi lần level up: +5 AP
- Đánh quái farming: +1~3 AP mỗi lần thắng
- Modal **"NÂNG CẤP ABILITY"** với nút +/- cho từng stat

### 3. 🌾 Hệ Thống Cày Quái (Farming)
- Button **"⚔️ CÀY QUÁI"** trong action bar
- 4 khu farming zone theo độ khó:

| Zone | Yêu cầu | Quái HP | Gold | AP | Skill Drops |
|------|---------|---------|------|----|-------------|
| 🌲 Rừng Goblin | LV1 | 30–60 | 10–30 | 1–3 | Breathing Stone, Normal Punch |
| 💀 Hang Xương | LV5 | 80–150 | 40–80 | 2–5 | Rasengan Fragment, Shadow Step Orb |
| 🌑 Rừng Ma | LV10 | 150–300 | 80–150 | 3–8 | Ki Crystal, Rubber Soul, Soul Fragment |
| 🔥 Đầm Quỷ | LV18 | 300–550 | 150–300 | 5–12 | Slime Core, Six Eyes Fragment, Scroll of Death |

### 4. 🌀 Skill Items từ Anime (VS Battles Wiki)

| Item | Nhân Vật | Kỹ Năng | Hiệu Ứng |
|------|----------|---------|----------|
| Breathing Stone | Tanjiro (Kimetsu) | Water Breathing 10th Form | ATK×2.2 damage |
| Normal Punch Scroll | Saitama (OPM) | Normal Punch | ATK×1.8, no MP cost |
| Rasengan Fragment | Naruto | Rasengan | ATK×2.5 + STR×1.5 |
| Shadow Step Orb | Sung Jin-Woo (Solo Leveling) | Shadow Step | Dodge + counter (ATK×2) |
| Ki Crystal | Son Goku (DB) | Kamehameha | INT×3 + ATK×1 |
| Rubber Soul | Luffy (One Piece) | Gear Second | +50% speed, ATK×2 for 3 turns |
| Soul Fragment | Ichigo (Bleach) | Getsuga Tensho | ATK×3 slash wave |
| Slime Core | Rimuru (Tensei Slime) | Predator | Absorb 20% enemy HP |
| Six Eyes Fragment | Gojo (JJK) | Infinity | Nullify next enemy attack |
| Scroll of Death | Ainz (Overlord) | Grasp Heart | Instant kill chance 30% |
| Limiter Shard | Saitama (OPM) | Serious Punch | ATK×8 (rare drop Arc7) |
| Thunder Scroll | Zenitsu (Kimetsu) | Thunderclap Flash | ATK×2.8 lightning |

### 5. ⚔️ Combat Animations (Sống Động Hơn)
- **Combat Scene Panel**: hiển thị ở giữa màn hình khi chiến đấu
  - Avatar người chơi bên trái ↔ Emoji quái bên phải
  - HP bar animated cho cả 2
  - Hiệu ứng tấn công: nhân vật lao về phía trước
  - **Floating damage numbers** pop lên và bay lên
  - Màn hình rung (shake) khi Boss tấn công
  - Flash đỏ khi nhân vật bị đánh
  - Hiệu ứng skill (glow, particles)
- Mỗi loại kỹ năng có màu hiệu ứng riêng

### 6. ⚖️ Cân Bằng Chỉ Số Quái

| Arc | Cũ (Creep HP) | Mới (Creep HP) | Cũ (Boss HP) | Mới (Boss HP) |
|-----|--------------|----------------|--------------|----------------|
| Arc 1 (LV1) | 200–350 | **60–120** | 800 | **300** |
| Arc 2 (LV5) | 450–650 | **150–280** | 1500 | **700** |
| Arc 3 (LV9) | 700–1000 | **280–500** | 2200 | **1200** |
| Arc 4 (LV14) | 1100–1700 | **500–850** | 3200 | **2000** |
| Arc 5 (LV19) | 1800–2600 | **850–1400** | 4500 | **3200** |
| Arc 6 (LV24) | 3000–4200 | **1500–2200** | 6500 | **4800** |
| Arc 7 (LV30) | 5000–7000 | **2200–3800** | 10000 | **7500** |

---

## Kế Hoạch Thực Hiện

### Bước 1: Viết phần CSS + HTML cấu trúc
- Title screen + Character Selection + Character Creation screen
- CSS animations (attack, hit, shake, floating damage, skill effects)
- Combat scene panel
- Farming modal, Ability Upgrade modal, Skill Book modal

### Bước 2: Viết Data & Game Logic
- ARCS_CONFIG với chỉ số đã cân bằng
- FARMING_ZONES data
- ANIME_SKILLS data
- Rebalanced game logic

### Bước 3: Viết hệ thống mới
- Character creation logic
- Farming system
- Ability upgrade system
- Skill system

### Bước 4: Viết Combat animations
- showFloatingDamage()
- triggerAttackAnimation()
- updateCombatScene()

---

## Verification Plan
- Mở Game.html trong trình duyệt
- Test: Tạo nhân vật mới, phân bổ 70 điểm
- Test: Vào Arc 1 và đánh quái (chỉ số cân bằng)
- Test: Cày quái ở Rừng Goblin, nhận AP và skill item
- Test: Nâng cấp ability với AP
- Test: Sử dụng skill item để unlock skill
- Test: Dùng skill trong combat
